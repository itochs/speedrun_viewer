import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export function useZoomableLineChart({
  monthlyStatistics,
  width,
  height,
  margin,
}) {
  const svgRef = useRef(null);
  const [zoomState, setZoomState] = useState({ data: null, transform: null });
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
  const transform =
    zoomState.data === monthlyStatistics ? zoomState.transform : null;
  const drawScale = transform ? transform.rescaleX(xScale) : xScale;
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

  useEffect(() => {
    if (!hasData || svgRef.current == null) {
      return;
    }
    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [margin.left, margin.top],
        [plotWidth, plotHeight],
      ])
      .on("zoom", (event) => {
        setZoomState({ data: monthlyStatistics, transform: event.transform });
      });
    svg.call(zoomBehavior);
    return () => svg.on(".zoom", null);
  }, [
    hasData,
    monthlyStatistics,
    margin.left,
    margin.top,
    plotWidth,
    plotHeight,
  ]);

  return {
    svgRef,
    plotWidth,
    plotHeight,
    runLinePath: line(monthlyStatistics ?? []),
    newPlayerLinePath: newPlayerLine(monthlyStatistics ?? []),
    xTicks: hasData
      ? drawScale
          .ticks()
          .filter(
            (index) =>
              Number.isInteger(index) &&
              index >= 0 &&
              index < monthlyStatistics.length,
          )
          .map((index) => ({
            x: drawScale(index),
            label: `${monthlyStatistics[index].year}年${monthlyStatistics[index].month}月`,
          }))
      : [],
    yTicks: yScale.ticks().map((value) => ({ y: yScale(value), label: value })),
  };
}
