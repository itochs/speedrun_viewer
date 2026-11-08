import * as d3 from "d3";

export function createChartGeometry({
  monthlyStatistics,
  width,
  height,
  margin,
  zoomTransform,
}) {
  const hasData = monthlyStatistics != null && monthlyStatistics.length > 0;
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const xScale = d3
    .scaleLinear()
    .domain([0, (monthlyStatistics?.length ?? 1) - 1])
    .range([0, plotWidth])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(
      hasData
        ? [
            0,
            d3.max(monthlyStatistics, (item) =>
              Math.max(item.runCount, item.newPlayerCount),
            ),
          ]
        : [0, 1],
    )
    .range([plotHeight, 0])
    .nice();
  const drawScale = zoomTransform ? zoomTransform.rescaleX(xScale) : xScale;
  const line = d3
    .line()
    .x((item, index) => drawScale(index))
    .y((item) => yScale(item.runCount))
    .curve(d3.curveLinear);
  const newPlayerLine = d3
    .line()
    .x((item, index) => drawScale(index))
    .y((item) => yScale(item.newPlayerCount))
    .curve(d3.curveLinear);

  return {
    plotWidth,
    plotHeight,
    drawScale,
    yScale,
    runLinePath: line(monthlyStatistics ?? []),
    newPlayerLinePath: newPlayerLine(monthlyStatistics ?? []),
  };
}
