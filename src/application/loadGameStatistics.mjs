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

  const runs = await client.fetchRuns(gameId, { signal });

  return {
    monthlyStatistics: calculateMonthlyRunStatistics(runs),
    games,
  };
}
