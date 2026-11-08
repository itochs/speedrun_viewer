import { useEffect, useRef, useState } from "react";
import { formatLoadedPeriod } from "../chart/summary.mjs";
import {
  loadGameStatistics,
  loadNextGameStatistics,
} from "../application/loadGameStatistics.mjs";

const emptyResult = {
  status: "loading",
  games: null,
  gameId: null,
  runs: [],
  monthlyStatistics: null,
  nextCursor: null,
  truncated: false,
  loadingMore: false,
  error: null,
  pageError: null,
};

function errorMessage(error, fallback) {
  const message = error?.message;
  return [
    "ゲームが見つかりませんでした。",
    "同じ記録ページが繰り返されています。",
  ].includes(message)
    ? message
    : fallback;
}

export function useGameStatistics(initialGameName = "super mario 64") {
  const [gameName, setGameName] = useState(initialGameName);
  const [result, setResult] = useState(emptyResult);
  const generationRef = useRef(0);
  const pageControllerRef = useRef(null);

  useEffect(() => {
    const generation = ++generationRef.current;
    const controller = new AbortController();
    pageControllerRef.current?.abort();
    pageControllerRef.current = null;
    setResult(emptyResult);

    loadGameStatistics(gameName, { signal: controller.signal })
      .then((loaded) => {
        if (generation === generationRef.current) {
          setResult({ ...emptyResult, ...loaded, status: "success" });
        }
      })
      .catch((error) => {
        if (
          generation === generationRef.current &&
          !controller.signal.aborted
        ) {
          setResult({
            ...emptyResult,
            status: "error",
            error: errorMessage(
              error,
              "データを取得できませんでした。時間をおいて再試行してください。",
            ),
          });
        }
      });

    return () => {
      generationRef.current += 1;
      controller.abort();
      pageControllerRef.current?.abort();
      pageControllerRef.current = null;
    };
  }, [gameName]);

  async function loadNextPage() {
    if (
      result.status !== "success" ||
      result.nextCursor == null ||
      pageControllerRef.current != null
    ) {
      return;
    }
    const controller = new AbortController();
    const generation = generationRef.current;
    pageControllerRef.current = controller;
    setResult((current) => ({
      ...current,
      loadingMore: true,
      pageError: null,
    }));

    try {
      const page = await loadNextGameStatistics(result, {
        signal: controller.signal,
      });
      if (generation === generationRef.current) {
        setResult((current) => ({
          ...current,
          ...page,
          loadingMore: false,
          pageError: null,
        }));
      }
    } catch (error) {
      if (generation === generationRef.current && !controller.signal.aborted) {
        setResult((current) => ({
          ...current,
          loadingMore: false,
          pageError: errorMessage(
            error,
            "次の記録を取得できませんでした。もう一度お試しください。",
          ),
        }));
      }
    } finally {
      if (pageControllerRef.current === controller) {
        pageControllerRef.current = null;
      }
    }
  }

  return {
    gameName,
    setGameName,
    games: result.games,
    selectedGameName:
      result.games?.find(({ id }) => id === result.gameId)?.name ?? null,
    monthlyStatistics: result.monthlyStatistics,
    periodLabel: formatLoadedPeriod(result.monthlyStatistics),
    loadedCount: result.runs.length,
    hasNextPage: result.nextCursor != null,
    truncated: result.truncated,
    loadingMore: result.loadingMore,
    status: result.status,
    error: result.error,
    pageError: result.pageError,
    loadNextPage,
  };
}
