import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";

function ZoomableLineChart({ ymData, width, height, margin, color }) {
  console.log("ZoomableLineChart");
  const svgRef = useRef();
  const [currentZoom, setCurrentZoom] = useState();

  const xScale = d3
    .scaleLinear()
    .domain([0, ymData.length - 1])
    .range([0, width - margin.left - margin.right])
    .nice();
  // const [xTicksState, setXTicksState] = useState(null);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(ymData, (d) => d.len))
    .range([height - margin.top - margin.bottom, 0])
    .nice();
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.len))
    .curve(d3.curveLinear);
  const newline = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d.newbielen))
    .curve(d3.curveLinear);

  const yTicks = yScale.ticks().map((y) => {
    return {
      y: yScale(y),
      label: y,
    };
  });

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgContent = svg.select(".content");

    if (currentZoom) {
      const newXScale = currentZoom.rescaleX(xScale);
      xScale.domain([
        Math.max(0, newXScale.domain()[0]),
        Math.min(ymData.length, newXScale.domain()[1]),
      ]);
      // xScale.domain(newXScale.domain());
    }

    svgContent
      .select(".line")
      .data([ymData])
      .join("path")
      .attr("stroke", "#022D39")
      .attr("stroke-width", "3")
      .attr("fill", "none")
      .attr("opacity", "0.5")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("d", line);

    svgContent
      .select(".newline")
      .data([ymData])
      .join("path")
      .attr("stroke", "#0794BD")
      .attr("stroke-width", "3")
      .attr("opacity", "0.5")
      .attr("fill", "none")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("d", newline);

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      if (d < ymData.length) {
        console.log(ymData[d].year);
        return `${ymData[d].year}年${ymData[d].month}月`;
      }
    });
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoom(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoom]);

  // if (xTicksState == null) {
  //   return <p>loading</p>;
  // }

  return (
    <div className="has-background-success-ligh">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        // transform={`translate(${margin.left}, ${margin.top})`}
      >
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
          <path className="line"></path>
          <path className="newline"></path>
        </g>
        <g
          className="x-axis"
          // transform={`translate(${margin.left}, ${height - margin.top})`}
        ></g>
        <g
          className="y-axis"
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={height - margin.bottom - margin.top}
            stroke={"black"}
            strokeWidth={1}
          />
          {yTicks.map((item) => {
            return (
              <g transform={`translate(0, ${item.y})`}>
                <line x1={0} y1={0} x2={-5} y2={0} stroke={"black"}></line>
                <text
                  x={-10}
                  fontSize={12}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {item.label}
                </text>
                <rect x={0} y={0} r={5} fill={"red"}></rect>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function Header() {
  return (
    <>
      <header className="hero is-success is-bold">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">this is header</h1>
          </div>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <>
      <footer className="footer has-background-dark">
        <div className="content has-text-centered">
          <p className="has-text-primary-light">this is footer</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const result = await api();
      setData(result);
    })();
  }, []);

  if (data == null) {
    return <p>loading</p>;
  }

  const { ymData } = data;
  const margin = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };
  const color = {
    axis: "#022D39",
  };
  // console.log(ymData);
  return (
    // <div className="has-background-grey-dark">
    <div>
      <Header />
      <ZoomableLineChart
        {...{ ymData, width: 600, height: 300, margin, color }}
      />
      <Footer />
    </div>
  );
}

export default App;
