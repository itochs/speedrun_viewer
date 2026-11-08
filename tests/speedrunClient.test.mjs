import assert from "node:assert/strict";
import test from "node:test";
import { speedrunClient } from "../src/infrastructure/speedrunClient.mjs";

const nextLink = (offset) => ({
  rel: "next",
  uri: `https://www.speedrun.com/api/v1/runs?game=game-1&orderby=verify-date&max=200&offset=${offset}`,
});

const runPage = (offset, nextOffset) => ({
  data: Array.from({ length: 200 }, (_, index) => ({
    id: `run-${offset + index}`,
    submitted: "2020-01-01",
    players: [],
  })),
  pagination: {
    offset,
    size: 200,
    max: 200,
    links: nextOffset == null ? [] : [nextLink(nextOffset)],
  },
});

test("fetches only one page even when it contains 200 runs", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    offsets.push(Number(url.searchParams.get("offset")));
    return { ok: true, json: async () => runPage(0, 200) };
  };

  const { runs, nextCursor, truncated } =
    await speedrunClient.fetchRunPage("game-1");
  assert.equal(runs.length, 200);
  assert.equal(nextCursor, nextLink(200).uri);
  assert.equal(truncated, false);
  assert.deepEqual(offsets, [0]);
});

test("rejects an offset 3800 link that points to itself", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    offsets.push(Number(url.searchParams.get("offset")));
    return { ok: true, json: async () => runPage(3800, 3800) };
  };

  await assert.rejects(
    speedrunClient.fetchRunPage("game-1", { cursor: nextLink(3800).uri }),
    /同じ記録ページが繰り返されています/,
  );
  assert.deepEqual(offsets, [3800]);
});

test("stops before offset 10000 and marks the loaded range partial", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    offsets.push(Number(url.searchParams.get("offset")));
    return { ok: true, json: async () => runPage(9800, 10000) };
  };

  const { runs, nextCursor, truncated } = await speedrunClient.fetchRunPage(
    "game-1",
    { cursor: nextLink(9800).uri },
  );
  assert.equal(runs.length, 200);
  assert.equal(nextCursor, null);
  assert.equal(truncated, true);
  assert.deepEqual(offsets, [9800]);
});
