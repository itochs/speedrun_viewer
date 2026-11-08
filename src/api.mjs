import { calculateMonthlyRunStatistics } from "./domain/monthlyRunStatistics.mjs";

function parseData(data) {
  return data.map((item) => ({
    submittedAt: new Date(item.submitted),
    playerIds: item.players.map(({ id }) => id),
  }));
}

async function getGameName(gamename, signal, max = 10) {
  const url = new URL("https://www.speedrun.com/api/v1/games");
  url.search = new URLSearchParams({
    _bulk: "yes",
    name: gamename,
    orderby: "similarity",
    max,
  });
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error("ゲームの検索に失敗しました。");
  }
  return response.json();
}

export default async function api(gamename, { signal } = {}) {
  const games = await getGameName(gamename, signal);
  const gameId = games.data?.[0]?.id;
  if (gameId == null) {
    throw new Error("ゲームが見つかりませんでした。");
  }

  const rundata = [];
  const max = 200;
  let offset = 0;
  const url = new URL("https://www.speedrun.com/api/v1/runs");
  url.search = new URLSearchParams({
    game: gameId,
    orderby: "verify-date",
    max,
  });

  while (true) {
    url.searchParams.set("offset", offset);
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error("記録の取得に失敗しました。");
    }
    const page = (await response.json()).data;
    rundata.push(...page.filter((item) => item.submitted != null));
    if (page.length < max) {
      break;
    }
    offset += page.length;
  }

  return {
    monthlyStatistics: calculateMonthlyRunStatistics(parseData(rundata)),
    games,
  };
}
