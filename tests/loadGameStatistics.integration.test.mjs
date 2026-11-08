import assert from "node:assert/strict";
import test from "node:test";
import {
  loadGameStatistics,
  loadNextGameStatistics,
} from "../src/application/loadGameStatistics.mjs";

const reply = (data, ok = true, pagination) => ({
  ok,
  json: async () => ({ data, pagination }),
});
const game = { id: "game-1", names: { international: "Game & More" } };
const runPagination = (offset, nextOffset) => ({
  offset,
  links:
    nextOffset == null
      ? []
      : [
          {
            rel: "next",
            uri: `https://www.speedrun.com/api/v1/runs?game=game-1&orderby=verify-date&max=200&offset=${nextOffset}`,
          },
        ],
});

test("loads one page initially and adds the next only when requested", async (t) => {
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
      return reply(
        [
          ...Array.from({ length: 199 }, (_, index) => ({
            id: `run-${index}`,
            submitted: "2020-01-10",
            players: [{ id: "player-a" }],
          })),
          { id: "run-199", submitted: null, players: [] },
        ],
        true,
        runPagination(0, 200),
      );
    }
    return reply(
      [
        {
          id: "run-200",
          submitted: "2020-04-10",
          players: [{ id: "player-b" }],
        },
        {
          id: "run-201",
          submitted: "2020-04-11",
          players: [{ id: "player-b" }],
        },
      ],
      true,
      runPagination(200),
    );
  };

  const first = await loadGameStatistics("Game & More");
  assert.deepEqual(first.games, [{ id: "game-1", name: "Game & More" }]);
  assert.deepEqual(offsets, [0]);
  assert.equal(first.runs.length, 199);
  assert.equal(first.monthlyStatistics[0].newPlayerCount, 1);

  const { monthlyStatistics, runs, nextCursor, truncated } =
    await loadNextGameStatistics(first);
  assert.deepEqual(offsets, [0, 200]);
  assert.equal(runs.length, 201);
  assert.equal(nextCursor, null);
  assert.equal(truncated, false);
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
