import assert from "node:assert/strict";
import test from "node:test";
import { loadGameStatistics } from "../src/application/loadGameStatistics.mjs";

const reply = (data, ok = true) => ({ ok, json: async () => ({ data }) });
const game = { id: "game-1", names: { international: "Game & More" } };

test("fetches every page and counts each new player once", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const offsets = [];
  globalThis.fetch = async (url) => {
    if (url.pathname.endsWith("/games")) {
      assert.equal(url.searchParams.get("name"), "Game & More");
      return reply([game]);
    }
    const offset = Number(url.searchParams.get("offset"));
    offsets.push(offset);
    if (offset === 0) {
      return reply([
        ...Array.from({ length: 199 }, () => ({
          submitted: "2020-01-10",
          players: [{ id: "player-a" }],
        })),
        { submitted: null, players: [] },
      ]);
    }
    return reply([
      { submitted: "2020-04-10", players: [{ id: "player-b" }] },
      { submitted: "2020-04-11", players: [{ id: "player-b" }] },
    ]);
  };

  const { monthlyStatistics, games } = await loadGameStatistics("Game & More");
  assert.deepEqual(games, [{ id: "game-1", name: "Game & More" }]);
  assert.deepEqual(offsets, [0, 200]);
  assert.deepEqual(
    monthlyStatistics
      .filter(({ runCount }) => runCount > 0)
      .map(({ month, runCount, newPlayerCount }) => ({
        month,
        runCount,
        newPlayerCount,
      })),
    [
      { month: 1, runCount: 199, newPlayerCount: 1 },
      { month: 4, runCount: 2, newPlayerCount: 1 },
    ],
  );
});

test("reports a search with no matching game", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async () => reply([]);
  await assert.rejects(
    loadGameStatistics("missing"),
    /ゲームが見つかりませんでした/,
  );
});

test("reports a failed runs request", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  globalThis.fetch = async (url) =>
    url.pathname.endsWith("/games") ? reply([game]) : reply([], false);
  await assert.rejects(loadGameStatistics("Game"), /記録の取得に失敗しました/);
});
