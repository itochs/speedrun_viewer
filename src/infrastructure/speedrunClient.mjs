export const speedrunClient = {
  async searchGames(gameName, { signal } = {}) {
    const url = new URL("https://www.speedrun.com/api/v1/games");
    url.search = new URLSearchParams({
      _bulk: "yes",
      name: gameName,
      orderby: "similarity",
      max: 10,
    });
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error("ゲームの検索に失敗しました。");
    }
    const { data } = await response.json();
    return data.map(({ id, names }) => ({ id, name: names.international }));
  },

  async fetchRuns(gameId, { signal } = {}) {
    const runs = [];
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
      const { data: page } = await response.json();
      runs.push(
        ...page
          .filter((item) => item.submitted != null)
          .map((item) => ({
            submittedAt: new Date(item.submitted),
            playerIds: item.players.map(({ id }) => id),
          })),
      );
      if (page.length < max) {
        break;
      }
      offset += page.length;
    }

    return runs;
  },
};
