import { useZoomableLineChart } from "../hooks/useZoomableLineChart";

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
    xTicks,
    yTicks,
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
          <g
            className="x-axis"
            transform={`translate(${margin.left}, ${height - margin.bottom})`}
          >
            <path d={`M0,6V0H${plotWidth}`} fill="none" stroke="currentColor" />
            {xTicks.map(({ x, label }) => (
              <g key={label} transform={`translate(${x}, 0)`}>
                <line y2={6} stroke="currentColor" />
                <text y={9} dy="0.71em" fontSize={10} textAnchor="middle">
                  {label}
                </text>
              </g>
            ))}
          </g>
          <g
            className="y-axis"
            transform={`translate(${margin.left}, ${margin.top})`}
          >
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={plotHeight}
              stroke="black"
              strokeWidth={1}
            />
            {yTicks.map((item) => (
              <g key={item.label} transform={`translate(0, ${item.y})`}>
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
