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

  async fetchRunPage(gameId, { cursor, signal } = {}) {
    // API v1 rejects offset=10000 even when the previous page links to it.
    const maxOffset = 10000;
    const pageUrl = cursor
      ? new URL(cursor)
      : new URL("https://www.speedrun.com/api/v1/runs");
    if (cursor == null) {
      pageUrl.search = new URLSearchParams({
        game: gameId,
        orderby: "verify-date",
        max: 200,
        offset: 0,
      });
    }
    if (
      pageUrl.origin !== "https://www.speedrun.com" ||
      pageUrl.pathname !== "/api/v1/runs" ||
      pageUrl.searchParams.get("game") !== gameId
    ) {
      throw new Error("記録ページのリンクが不正です。");
    }

    const response = await fetch(pageUrl, { signal });
    if (!response.ok) {
      throw new Error("記録の取得に失敗しました。");
    }
    const { data: page, pagination } = await response.json();
    if (!Array.isArray(page) || pagination == null) {
      throw new Error("記録ページの情報が不正です。");
    }
    const offset = Number(pageUrl.searchParams.get("offset"));
    if (pagination.offset !== offset) {
      throw new Error("記録ページの位置が一致しません。");
    }
    const runs = page
      .filter((item) => item.submitted != null)
      .map((item) => ({
        id: item.id,
        submittedAt: new Date(item.submitted),
        playerIds: item.players.map(({ id }) => id),
      }));
    const nextLink = pagination.links?.find(({ rel }) => rel === "next");
    const nextUrl = nextLink ? new URL(nextLink.uri, pageUrl) : null;
    if (nextUrl != null) {
      const nextOffset = Number(nextUrl.searchParams.get("offset"));
      if (!Number.isInteger(nextOffset) || nextOffset <= offset) {
        throw new Error("同じ記録ページが繰り返されています。");
      }
      if (nextOffset >= maxOffset) {
        return { runs, nextCursor: null, truncated: true };
      }
    }

    return { runs, nextCursor: nextUrl?.toString() ?? null, truncated: false };
  },
};
