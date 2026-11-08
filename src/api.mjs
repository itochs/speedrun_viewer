import { calculateMonthlyRunStatistics } from "./domain/monthlyRunStatistics.mjs";
import { speedrunClient } from "./infrastructure/speedrunClient.mjs";

export default async function api(gamename, { signal } = {}) {
  const games = await speedrunClient.searchGames(gamename, { signal });
  const gameId = games[0]?.id;
  if (gameId == null) {
    throw new Error("ゲームが見つかりませんでした。");
  }

  const runs = await speedrunClient.fetchRuns(gameId, { signal });

  return {
    monthlyStatistics: calculateMonthlyRunStatistics(runs),
    games,
  };
}
