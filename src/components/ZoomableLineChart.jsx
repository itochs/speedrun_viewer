import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

function ZoomableLineChart({
  monthlyStatistics,
  width,
  height,
  margin,
  color,
  children,
}) {
  const svgRef = useRef();
  const [currentZoom, setCurrentZoom] = useState();

  const xScale = d3
    .scaleLinear()
    .domain([0, (monthlyStatistics?.length ?? 1) - 1])
    .range([0, width - margin.left - margin.right])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(
      monthlyStatistics == null || monthlyStatistics.length === 0
        ? [0, 1]
        : [
            0,
            d3.max(monthlyStatistics, (d) =>
              Math.max(d.runCount, d.newPlayerCount),
            ),
          ],
    )
    .range([height - margin.top - margin.bottom, 0])
    .nice();

  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.runCount))
    .curve(d3.curveLinear);
  const newline = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.newPlayerCount))
    .curve(d3.curveLinear);

  const yTicks = yScale.ticks().map((y) => ({
    y: yScale(y),
    label: y,
  }));

  useEffect(() => {
    if (monthlyStatistics == null || monthlyStatistics.length === 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const svgContent = svg.select(".content");
    const drawScale = currentZoom ? currentZoom.rescaleX(xScale) : xScale;

    svgContent
      .select(".line")
      .data([monthlyStatistics])
      .join("path")
      .attr("stroke", color.all.fill)
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .attr("opacity", color.all.opacity)
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr(
        "d",
        d3
          .line()
          .x((d, i) => drawScale(i))
          .y((d) => yScale(d.runCount))
          .curve(d3.curveLinear),
      );

    svgContent
      .select(".newline")
      .data([monthlyStatistics])
      .join("path")
      .attr("stroke", color.new.fill)
      .attr("stroke-width", 1)
      .attr("opacity", color.new.opacity)
      .attr("fill", "none")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr(
        "d",
        d3
          .line()
          .x((d, i) => drawScale(i))
          .y((d) => yScale(d.newPlayerCount))
          .curve(d3.curveLinear),
      );

    const xAxis = d3.axisBottom(drawScale).tickFormat((d) => {
      if (
        d >= monthlyStatistics.length ||
        d < 0 ||
        !Number.isInteger(d) ||
        monthlyStatistics[d] == null
      ) {
        return "";
      }
      return `${monthlyStatistics[d].year}年${monthlyStatistics[d].month}月`;
    });

    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [margin.left, margin.top],
        [
          width - margin.right - margin.left,
          height - margin.bottom - margin.top,
        ],
      ])
      .on("zoom", (event) => {
        setCurrentZoom(event.transform);
      });

    svg.call(zoomBehavior);
  }, [
    currentZoom,
    monthlyStatistics,
    xScale,
    yScale,
    color,
    margin,
    width,
    height,
  ]);

  if (monthlyStatistics == null) {
    return <p className="py-6 text-center text-slate-600">loading</p>;
  }
  if (monthlyStatistics.length === 0) {
    return (
      <p className="py-6 text-center text-slate-600">記録がありません。</p>
    );
  }

  return (
    <div className="mt-4 select-none rounded-xl bg-cyan-50 p-3 ring-1 ring-cyan-200 sm:p-4">
      <div className="mx-auto w-full max-w-4xl">
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <clipPath id="clip">
              <rect
                x={margin.left}
                y={margin.top}
                width={width - margin.left - margin.right}
                height={height - margin.top - margin.bottom}
              />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#clip)">
            <path className="line" d={line(monthlyStatistics)} />
            <path className="newline" d={newline(monthlyStatistics)} />
          </g>
          <g className="x-axis" />
          <g
            className="y-axis"
            transform={`translate(${margin.left}, ${margin.top})`}
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={height - margin.bottom - margin.top}
              stroke="black"
              strokeWidth={1}
            />
            {yTicks.map((item, i) => (
              <g key={i} transform={`translate(0, ${item.y})`}>
                <line x1={0} y1={0} x2={-5} y2={0} stroke="black" />
                <text
                  x={-10}
                  fontSize={12}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {item.label}
                </text>
              </g>
            ))}
          </g>
          <g>{children}</g>
        </svg>
      </div>
    </div>
  );
}

export default ZoomableLineChart;
