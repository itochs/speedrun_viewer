function XAxis({ ticks, plotWidth, margin, height }) {
  return (
    <g
      className="x-axis"
      transform={`translate(${margin.left}, ${height - margin.bottom})`}
    >
      <path d={`M0,6V0H${plotWidth}`} fill="none" stroke="currentColor" />
      {ticks.map(({ x, label }) => (
        <g key={label} transform={`translate(${x}, 0)`}>
          <line y2={6} stroke="currentColor" />
          <text y={9} dy="0.71em" fontSize={10} textAnchor="middle">
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}

export default XAxis;
