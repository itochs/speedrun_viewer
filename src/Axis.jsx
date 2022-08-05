import { rgb } from "d3";

function XAxis({ xTicks, axisColor }) {
  return (
    <g className="x-axis" transform="translate(0, 400)">
      <line x1={0} y1={0} x2={400} y2={0} stroke={axisColor} strokeWidth={1} />
      <g className="x-axis-label">
        {xTicks.map((tick, index) => {
          return (
            <g key={index} transform={`translate(${tick.x}, 0)`}>
              <line x1={0} y1={0} x2={0} y2={5} stroke={axisColor} />
              <text
                x={0}
                y={10}
                fontSize={12}
                textAnchor={"middle"}
                dominantBaseline={"hanging"}
                style={{ userSelect: "none" }}
                fill={axisColor}
              >
                {tick.label}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function YAxis({ yTicks, axisColor }) {
  return (
    <g className="y-axis" transform="translate(0, 0)">
      <line x1={0} y1={0} x2={0} y2={400} stroke={axisColor} strokeWidth={1} />
      {yTicks.map((tick, index) => {
        return (
          <g key={index} transform={`translate(0, ${tick.y})`}>
            <line x1={0} y1={0} x2={-5} y2={0} stroke={axisColor} />
            <text
              x={-10}
              y={0}
              fontSize={12}
              textAnchor={"end"}
              dominantBaseline={"middle"}
              style={{ userSelect: "none" }}
              fill={axisColor}
            >
              {tick.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function Axis({ xTicks, yTicks }) {
  const axisColor = rgb(59, 246, 130, 0.5);
  return (
    <g>
      <XAxis {...{ xTicks, axisColor }} />
      <YAxis {...{ yTicks, axisColor }} />
    </g>
  );
}
