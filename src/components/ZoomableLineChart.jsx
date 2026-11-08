import { useZoomableLineChart } from "../hooks/useZoomableLineChart";
import XAxis from "./XAxis";
import YAxis from "./YAxis";

function ZoomableLineChart({
  monthlyStatistics,
  width,
  height,
  margin,
  color,
  children,
}) {
  const {
    svgRef,
    plotWidth,
    plotHeight,
    runLinePath,
    newPlayerLinePath,
    drawScale,
    yScale,
  } = useZoomableLineChart({ monthlyStatistics, width, height, margin });

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
                width={plotWidth}
                height={plotHeight}
              />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#clip)">
            <path
              d={runLinePath}
              transform={`translate(${margin.left}, ${margin.top})`}
              stroke={color.all.fill}
              strokeWidth={1}
              opacity={color.all.opacity}
              fill="none"
            />
            <path
              d={newPlayerLinePath}
              transform={`translate(${margin.left}, ${margin.top})`}
              stroke={color.new.fill}
              strokeWidth={1}
              opacity={color.new.opacity}
              fill="none"
            />
          </g>
          <XAxis
            scale={drawScale}
            monthlyStatistics={monthlyStatistics}
            plotWidth={plotWidth}
            margin={margin}
            height={height}
          />
          <YAxis scale={yScale} plotHeight={plotHeight} margin={margin} />
          <g>{children}</g>
        </svg>
      </div>
    </div>
  );
}

export default ZoomableLineChart;
