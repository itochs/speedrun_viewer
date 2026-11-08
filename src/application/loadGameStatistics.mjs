import { calculateMonthlyRunStatistics } from "../domain/monthlyRunStatistics.mjs";
import { speedrunClient } from "../infrastructure/speedrunClient.mjs";

export async function loadGameStatistics(
  gameName,
  { signal, client = speedrunClient } = {},
) {
  const games = await client.searchGames(gameName, { signal });
  const gameId = games[0]?.id;
  if (gameId == null) {
    throw new Error("ゲームが見つかりませんでした。");
  }

  const { runs, nextCursor, truncated } = await client.fetchRunPage(gameId, {
    signal,
  });

  return {
    monthlyStatistics: calculateMonthlyRunStatistics(runs),
    games,
    gameId,
    runs,
    nextCursor,
    truncated,
  };
}

export async function loadNextGameStatistics(
  { gameId, runs: loadedRuns, nextCursor },
  { signal, client = speedrunClient } = {},
) {
  if (nextCursor == null) {
    throw new Error("次の記録ページがありません。");
  }
  const page = await client.fetchRunPage(gameId, {
    cursor: nextCursor,
    signal,
  });
  const seenIds = new Set(loadedRuns.map(({ id }) => id));
  const newRuns = page.runs.filter(({ id }) => id == null || !seenIds.has(id));
  if (page.runs.length > 0 && newRuns.length === 0) {
    throw new Error("同じ記録ページが繰り返されています。");
  }
  const runs = [...loadedRuns, ...newRuns];

  return {
    runs,
    monthlyStatistics: calculateMonthlyRunStatistics(runs),
    nextCursor: page.nextCursor,
    truncated: page.truncated,
  };
}
