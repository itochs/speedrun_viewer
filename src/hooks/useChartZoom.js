import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export function useChartZoom({ monthlyStatistics, width, height, margin }) {
  const svgRef = useRef(null);
  const [zoomState, setZoomState] = useState({ data: null, transform: null });

  useEffect(() => {
    if (
      monthlyStatistics == null ||
      monthlyStatistics.length === 0 ||
      svgRef.current == null
    ) {
      return;
    }
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
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
    monthlyStatistics,
    width,
    height,
    margin.left,
    margin.right,
    margin.top,
    margin.bottom,
  ]);

  return {
    svgRef,
    zoomTransform:
      zoomState.data === monthlyStatistics ? zoomState.transform : null,
  };
}
