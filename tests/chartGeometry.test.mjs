import assert from "node:assert/strict";
import test from "node:test";
import * as d3 from "d3";
import { createChartGeometry } from "../src/chart/geometry.mjs";

test("zoom changes horizontal positions without changing the counts scale", () => {
  const options = {
    monthlyStatistics: [
      { year: 2020, month: 1, runCount: 1, newPlayerCount: 1 },
      { year: 2020, month: 2, runCount: 3, newPlayerCount: 2 },
    ],
    width: 600,
    height: 300,
    margin: { left: 50, right: 125, top: 50, bottom: 50 },
  };
  const original = createChartGeometry(options);
  const zoomed = createChartGeometry({
    ...options,
    zoomTransform: d3.zoomIdentity.scale(2),
  });

  assert.equal(zoomed.drawScale(1), original.drawScale(1) * 2);
  assert.equal(zoomed.yScale(3), original.yScale(3));
  assert.notEqual(zoomed.runLinePath, original.runLinePath);
  assert.notEqual(zoomed.newPlayerLinePath, original.newPlayerLinePath);
});
