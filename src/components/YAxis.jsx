import { createYTicks } from "../chart/ticks.mjs";

function YAxis({ scale, plotHeight, margin }) {
  const ticks = createYTicks(scale);
  return (
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
      {ticks.map(({ y, label }) => (
        <g key={label} transform={`translate(0, ${y})`}>
          <line x1={0} y1={0} x2={-5} y2={0} stroke="black" />
          <text
            x={-10}
            fontSize={12}
            textAnchor="end"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

export default YAxis;
