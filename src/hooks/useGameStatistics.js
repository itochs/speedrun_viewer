import { useEffect, useState } from "react";
import { loadGameStatistics } from "../application/loadGameStatistics.mjs";

export function useGameStatistics(initialGameName = "super mario 64") {
  const [gameName, setGameName] = useState(initialGameName);
  const [result, setResult] = useState({
    status: "loading",
    monthlyStatistics: null,
    games: null,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setResult({
      status: "loading",
      monthlyStatistics: null,
      games: null,
      error: null,
    });

    loadGameStatistics(gameName, { signal: controller.signal })
      .then(({ monthlyStatistics, games }) => {
        if (active) {
          setResult({
            status: "success",
            monthlyStatistics,
            games,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (active) {
          setResult({
            status: "error",
            monthlyStatistics: null,
            games: null,
            error:
              error.message === "ゲームが見つかりませんでした。"
                ? error.message
                : "データを取得できませんでした。時間をおいて再試行してください。",
          });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [gameName]);

  return { gameName, setGameName, ...result };
}
