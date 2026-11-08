import assert from "node:assert/strict";
import test from "node:test";
import { loadGameStatistics } from "../src/application/loadGameStatistics.mjs";

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
    async fetchRuns(id, options) {
      calls.push(["runs", id, options.signal]);
      return {
        runs: [{ submittedAt: new Date("2020-01-10"), playerIds: ["a"] }],
        truncated: false,
      };
    },
  };

  const result = await loadGameStatistics("query", { signal, client });
  assert.deepEqual(calls, [
    ["search", "query", signal],
    ["runs", "first", signal],
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
});

test("does not request runs when no game matches", async () => {
  const client = {
    async searchGames() {
      return [];
    },
    async fetchRuns() {
      assert.fail("runs must not be requested");
    },
  };
  await assert.rejects(
    loadGameStatistics("missing", { client }),
    /ゲームが見つかりませんでした/,
  );
});
