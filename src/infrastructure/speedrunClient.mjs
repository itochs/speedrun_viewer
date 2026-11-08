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
    // API v1 rejects offset=10000 even when the previous page links to it.
    const maxOffset = 10000;
    const runs = [];
    const seenUrls = new Set();
    const seenPages = new Set();
    let truncated = false;
    let pageUrl = new URL("https://www.speedrun.com/api/v1/runs");
    pageUrl.search = new URLSearchParams({
      game: gameId,
      orderby: "verify-date",
      max: 200,
      offset: 0,
    });

    while (pageUrl != null) {
      const requestUrl = pageUrl.toString();
      if (seenUrls.has(requestUrl)) {
        throw new Error("同じ記録ページが繰り返されています。");
      }
      seenUrls.add(requestUrl);

      const response = await fetch(pageUrl, { signal });
      if (!response.ok) {
        throw new Error("記録の取得に失敗しました。");
      }
      const { data: page, pagination } = await response.json();
      if (!Array.isArray(page) || pagination == null) {
        throw new Error("記録ページの情報が不正です。");
      }
      if (pagination.offset !== Number(pageUrl.searchParams.get("offset"))) {
        throw new Error("記録ページの位置が一致しません。");
      }
      const pageIds = page.map(({ id }) => id);
      if (pageIds.length > 0 && pageIds.every((id) => id != null)) {
        const pageKey = pageIds.join(",");
        if (seenPages.has(pageKey)) {
          throw new Error("同じ記録ページが繰り返されています。");
        }
        seenPages.add(pageKey);
      }
      runs.push(
        ...page
          .filter((item) => item.submitted != null)
          .map((item) => ({
            submittedAt: new Date(item.submitted),
            playerIds: item.players.map(({ id }) => id),
          })),
      );
      const nextLink = pagination.links?.find(({ rel }) => rel === "next");
      pageUrl = nextLink ? new URL(nextLink.uri, requestUrl) : null;
      if (
        pageUrl != null &&
        Number(pageUrl.searchParams.get("offset")) >= maxOffset
      ) {
        truncated = true;
        break;
      }
    }

    return { runs, truncated };
  },
};
