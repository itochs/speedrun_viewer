import assert from "node:assert/strict";
import test from "node:test";
import {
  loadGameStatistics,
  loadNextGameStatistics,
} from "../src/application/loadGameStatistics.mjs";

test("loads the first matching game and aggregates its runs", async () => {
  const signal = new AbortController().signal;
  const calls = [];
  const client = {
    async searchGames(name, options) {
      calls.push(["search", name, options.signal]);
      return [
        { id: "first", name: "First" },
        { id: "second", name: "Second" },
      ];
    },
    async fetchRunPage(id, options) {
      calls.push(["runs", id, options.cursor, options.signal]);
      return {
        runs: [
          {
            id: "run-1",
            submittedAt: new Date("2020-01-10"),
            playerIds: ["a"],
          },
        ],
        nextCursor: "next-page",
        truncated: false,
      };
    },
  };

  const result = await loadGameStatistics("query", { signal, client });
  assert.deepEqual(calls, [
    ["search", "query", signal],
    ["runs", "first", undefined, signal],
  ]);
  assert.deepEqual(result.games, [
    { id: "first", name: "First" },
    { id: "second", name: "Second" },
  ]);
  assert.deepEqual(result.monthlyStatistics[0], {
    year: 2020,
    month: 1,
    runCount: 1,
    newPlayerCount: 1,
  });
  assert.equal(result.truncated, false);
  assert.equal(result.gameId, "first");
  assert.equal(result.nextCursor, "next-page");
});

test("adds a requested page to the existing statistics", async () => {
  const signal = new AbortController().signal;
  const client = {
    async searchGames() {
      assert.fail("a later page must not repeat the game search");
    },
    async fetchRunPage(id, options) {
      assert.equal(id, "first");
      assert.equal(options.cursor, "next-page");
      assert.equal(options.signal, signal);
      return {
        runs: [
          {
            id: "run-2",
            submittedAt: new Date("2020-04-10"),
            playerIds: ["b"],
          },
        ],
        nextCursor: null,
        truncated: false,
      };
    },
  };

  const result = await loadNextGameStatistics(
    {
      gameId: "first",
      runs: [
        { id: "run-1", submittedAt: new Date("2020-01-10"), playerIds: ["a"] },
      ],
      nextCursor: "next-page",
    },
    { signal, client },
  );
  assert.equal(result.runs.length, 2);
  assert.deepEqual(
    result.monthlyStatistics
      .filter(({ runCount }) => runCount > 0)
      .map(({ month, runCount, newPlayerCount }) => ({
        month,
        runCount,
        newPlayerCount,
      })),
    [
      { month: 1, runCount: 1, newPlayerCount: 1 },
      { month: 4, runCount: 1, newPlayerCount: 1 },
    ],
  );
  assert.equal(result.nextCursor, null);
});

test("does not request runs when no game matches", async () => {
  const client = {
    async searchGames() {
      return [];
    },
    async fetchRunPage() {
      assert.fail("runs must not be requested");
    },
  };
  await assert.rejects(
    loadGameStatistics("missing", { client }),
    /ゲームが見つかりませんでした/,
  );
});
