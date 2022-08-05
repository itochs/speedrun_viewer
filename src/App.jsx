import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";

function ZoomableLineChart({ ymData, width, height, margin }) {
  console.log("ZoomableLineChart");
  const svgRef = useRef();
  console.log(ymData);
  const [currentZoom, setCurrentZoom] = useState();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(ymData, (d) => d.len))
    .range([height, 0])
    .nice();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgContent = svg.select(".content");

    const xScale = d3
      .scaleLinear()
      .domain([0, ymData.length - 1])
      .range([0, width])
      .nice();

    if (currentZoom) {
      const newXScale = currentZoom.rescaleX(xScale);
      //   console.log(xScale.domain());
      //   console.log(newXScale.domain());
      xScale.domain(newXScale.domain());
    }

    // console.log(ymData);

    // console.log(lineItem);
    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.len))
      .curve(d3.curveLinear);

    svgContent
      .select(".line")
      .data([ymData])
      .join("path")
      // .attr("className", "myline")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("d", line);

    const newline = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.newbielen))
      .curve(d3.curveLinear);

    svgContent
      .select(".newline")
      .data([ymData])
      .join("path")
      // .attr("className", "myline")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("d", newline);

    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.left})`)
      .call(yAxis);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [margin.left, margin.top],
        [width + margin.left, height + margin.top],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoom(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoom]);

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width + margin.right + margin.left} ${
          height + margin.bottom + margin.top
        }`}
        transform={`translate(${margin.left}, ${margin.top})`}
      >
        <defs>
          <clipPath id="clip">
            <rect
              x={margin.left}
              y={margin.top}
              width={width}
              height={height}
            />
          </clipPath>
        </defs>
        <g className="content" clipPath="url(#clip)">
          <path className="line"></path>
          <path className="newline"></path>
        </g>
        <g className="x-axis"></g>
        <g className="y-axis"></g>
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

  const { data: runs, players, yearData, ymData } = data;
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };
  // console.log(ymData);
  return (
    // <div className="has-background-grey-dark">
    <div>
      {/* <Header />
      <TrendChart {...{ data, width: 600, height: 300 }} />
      <Footer /> */}
      <ZoomableLineChart {...{ ymData, width: 600, height: 300, margin }} />
      {/* <Chart {...{ data, width: 600, height: 300 }} /> */}
    </div>
  );
}

export default App;
