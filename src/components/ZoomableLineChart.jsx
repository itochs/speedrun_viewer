import { createChartGeometry } from "../chart/geometry.mjs";
import { useChartZoom } from "../hooks/useChartZoom";
import XAxis from "./XAxis";
import YAxis from "./YAxis";

function ZoomableLineChart({
  monthlyStatistics,
  width,
  height,
  margin,
  color,
}) {
  const { svgRef, zoomTransform } = useChartZoom({
    monthlyStatistics,
    width,
    height,
    margin,
  });
  const {
    plotWidth,
    plotHeight,
    runLinePath,
    newPlayerLinePath,
    drawScale,
    yScale,
  } = createChartGeometry({
    monthlyStatistics,
    width,
    height,
    margin,
    zoomTransform,
  });

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
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="投稿日で集計した月別の投稿記録数と初登場ユーザー数の折れ線グラフ"
        >
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
              stroke={color.runs}
              strokeWidth={2}
              fill="none"
            />
            <path
              d={newPlayerLinePath}
              transform={`translate(${margin.left}, ${margin.top})`}
              stroke={color.firstSeen}
              strokeWidth={2}
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
          <text
            x={margin.left}
            y={margin.top - 18}
            fontSize={12}
            fill={color.runs}
          >
            件 / 人
          </text>
          <text
            x={margin.left + plotWidth / 2}
            y={height - 8}
            fontSize={12}
            textAnchor="middle"
            fill={color.runs}
          >
            投稿日（月）
          </text>
        </svg>
      </div>
    </div>
  );
}

export default ZoomableLineChart;
