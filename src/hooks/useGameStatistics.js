import { useEffect, useState } from "react";
import { loadGameStatistics } from "../application/loadGameStatistics.mjs";

export function useGameStatistics(initialGameName = "super mario 64") {
  const [gameName, setGameName] = useState(initialGameName);
  const [result, setResult] = useState({
    status: "loading",
    monthlyStatistics: null,
    games: null,
    truncated: false,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setResult({
      status: "loading",
      monthlyStatistics: null,
      games: null,
      truncated: false,
      error: null,
    });

    loadGameStatistics(gameName, { signal: controller.signal })
      .then(({ monthlyStatistics, games, truncated }) => {
        if (active) {
          setResult({
            status: "success",
            monthlyStatistics,
            games,
            truncated,
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
            truncated: false,
            error: [
              "ゲームが見つかりませんでした。",
              "同じ記録ページが繰り返されています。",
            ].includes(error.message)
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
