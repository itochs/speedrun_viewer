import assert from "node:assert/strict";
import test from "node:test";
import { calculateMonthlyRunStatistics } from "../src/domain/monthlyRunStatistics.mjs";

const run = (submitted, ...playerIds) => ({
  submittedAt: new Date(submitted),
  playerIds,
});

test("counts registered players on their first month, regardless of run order", () => {
  const result = calculateMonthlyRunStatistics([
    run("2021-01-10", "a", "c"),
    run("2020-04-11", "b"),
    run("2020-01-10", "a", null),
    run("2020-04-10", "b", "a"),
  ]);

  assert.deepEqual(
    result
      .filter(({ runCount }) => runCount > 0)
      .map(({ year, month, runCount, newPlayerCount }) => ({
        year,
        month,
        runCount,
        newPlayerCount,
      })),
    [
      { year: 2020, month: 1, runCount: 1, newPlayerCount: 1 },
      { year: 2020, month: 4, runCount: 2, newPlayerCount: 1 },
      { year: 2021, month: 1, runCount: 1, newPlayerCount: 1 },
    ],
  );
  assert.equal(result.length, 24);
});

test("returns no statistics when there are no runs", () => {
  assert.deepEqual(calculateMonthlyRunStatistics([]), []);
});
