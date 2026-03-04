function Legend({ width, margin, color }) {
  const lwidth = 15;
  const lheight = 15;
  const padding = 10;

  return (
    <g
      transform={`translate(${width - margin.right + padding}, ${
        margin.top + padding
      })`}
    >
      <g>
        <rect
          x={0}
          y={0}
          width={lwidth}
          height={lheight}
          fill={color.all.fill}
          opacity={color.all.opacity}
        />
        <text
          x={lwidth + padding}
          textAnchor="start"
          dominantBaseline="hanging"
        >
          All player
        </text>
      </g>
      <g transform={`translate(0, ${lheight + padding})`}>
        <rect
          x={0}
          y={0}
          width={lwidth}
          height={lheight}
          fill={color.new.fill}
          opacity={color.all.opacity}
        />
        <text
          x={lwidth + padding}
          textAnchor="start"
          dominantBaseline="hanging"
        >
          New player
        </text>
      </g>
    </g>
  );
}

export default Legend;
