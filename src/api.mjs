function parseData(data) {
  return data.map((item) => ({
    ...item,
    submitted: new Date(item.submitted),
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

function getYearData(data) {
  const years = [
    ...new Set(data.map((item) => item.submitted.getUTCFullYear())),
  ].sort((a, b) => a - b);
  const oldPlayers = new Set();
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return years.flatMap((year) => {
    const yearData = data.filter(
      (item) => item.submitted.getUTCFullYear() === year,
    );
    return months.map((month) => {
      const monthData = yearData.filter(
        (item) => item.submitted.getUTCMonth() === month - 1,
      );
      const newPlayers = new Set();
      monthData.forEach((item) => {
        item.players.forEach(({ id }) => {
          if (id != null && !oldPlayers.has(id)) {
            newPlayers.add(id);
          }
        });
      });
      newPlayers.forEach((id) => oldPlayers.add(id));

      return {
        year,
        month,
        len: monthData.length,
        newbielen: newPlayers.size,
      };
    });
  });
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

  return { ymData: getYearData(parseData(rundata)), games };
}
