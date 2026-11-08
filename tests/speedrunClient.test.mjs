import assert from "node:assert/strict";
import test from "node:test";
import { speedrunClient } from "../src/infrastructure/speedrunClient.mjs";

const nextLink = (offset) => ({
  rel: "next",
  uri: `https://www.speedrun.com/api/v1/runs?game=game-1&orderby=verify-date&max=200&offset=${offset}`,
});

test("stops after a full page when the API has no next link", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    offsets.push(Number(url.searchParams.get("offset")));
    return {
      ok: true,
      json: async () => ({
        data: Array.from({ length: 200 }, (_, index) => ({
          id: `run-${index}`,
          submitted: "2020-01-01",
          players: [],
        })),
        pagination: { offset: 0, size: 200, max: 200, links: [] },
      }),
    };
  };

  const { runs, truncated } = await speedrunClient.fetchRuns("game-1");
  assert.equal(runs.length, 200);
  assert.equal(truncated, false);
  assert.deepEqual(offsets, [0]);
});

test("does not request offset 3800 twice when a next link loops", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    const offset = Number(url.searchParams.get("offset"));
    offsets.push(offset);
    const nextOffset = offset === 3800 ? 3800 : offset + 200;
    return {
      ok: true,
      json: async () => ({
        data: Array.from({ length: 200 }, (_, index) => ({
          id: `run-${offset + index}`,
          submitted: "2020-01-01",
          players: [],
        })),
        pagination: {
          offset,
          size: 200,
          max: 200,
          links: [nextLink(nextOffset)],
        },
      }),
    };
  };

  await assert.rejects(
    speedrunClient.fetchRuns("game-1"),
    /同じ記録ページが繰り返されています/,
  );
  assert.equal(offsets.filter((offset) => offset === 3800).length, 1);
  assert.deepEqual(offsets.slice(-2), [3600, 3800]);
});

test("stops before the API's 10000-offset limit and marks the data partial", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });
  const offsets = [];
  globalThis.fetch = async (url) => {
    const offset = Number(url.searchParams.get("offset"));
    offsets.push(offset);
    return {
      ok: true,
      json: async () => ({
        data: Array.from({ length: 200 }, (_, index) => ({
          id: `run-${offset + index}`,
          submitted: "2020-01-01",
          players: [],
        })),
        pagination: {
          offset,
          size: 200,
          max: 200,
          links: [nextLink(offset + 200)],
        },
      }),
    };
  };

  const { runs, truncated } = await speedrunClient.fetchRuns("game-1");
  assert.equal(runs.length, 10000);
  assert.equal(truncated, true);
  assert.equal(offsets.at(-1), 9800);
  assert.equal(offsets.includes(10000), false);
});
