import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";

function ZoomableLineChart({ ymData, width, height, margin, color }) {
  console.log("ZoomableLineChart");
  // console.log(ymData);
  const svgRef = useRef();
  const [currentZoom, setCurrentZoom] = useState();
  const [xTicksValue, setXTicksValue] = useState();

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
      xScale.domain(newXScale.domain());
      // console.log(newXScale.ticks());
      setXTicksValue(newXScale.ticks());
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

    const xAxis = d3.axisBottom(xScale);
    // .tickFormat((d, i) => {
    //   console.log("d", d);
    //   if (!d || d >= ymData.length || d < 0 || Number.isInteger(d)) {
    //     // console.log(ymData[d].year);
    //     return;
    //   }
    //   console.log(ymData[d]);
    //   return `${ymData[d].year}年${ymData[d].month}月`;
    // });
    svg
      .select(".x-axis")
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(xAxis);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 5])
      .translateExtent([
        [margin.left, margin.top],
        [
          width - margin.right - margin.left,
          height - margin.bottom - margin.top,
        ],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoom(zoomState);
      });

    svg.call(zoomBehavior);
  }, [currentZoom]);

  return (
    <div className="has-background-success-ligh">
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
          <path className="line"></path>
          <path className="newline"></path>
        </g>
        <g className="x-axis"></g>
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
          {yTicks.map((item, i) => {
            return (
              <g key={i} transform={`translate(0, ${item.y})`}>
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

function Selector({ setGameName, games }) {
  const inputRef = useRef();
  return (
    <div>
      <div>
        <input
          className="input is-primary"
          ref={inputRef}
          type={"text"}
          defaultValue={"super mario 64"}
        />
        <button
          className="button is-dark"
          onClick={() => {
            console.log(inputRef.current.value);
            setGameName(inputRef.current.value);
          }}
        >
          search
        </button>
      </div>

      <div className="select">
        <select
          onChange={(event) => {
            event.preventDefault();
            setGameName(event.target.value);
          }}
        >
          {games["data"].map(({ names }, i) => {
            return (
              <option key={i} value={names["international"]}>
                {names["international"]}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
// function DropDownItem(value){
//   return
// }

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
  const [data, setData] = useState({
    ymData: null,
    games: null,
    loading: true,
  });
  // const [ymData, setYmData] = useState({ data: null, loading: true });
  // const [games, setGames] = useState({ data: null, loading: true });
  const [gameName, setGameName] = useState("super mario 64");

  useEffect(() => {
    (async () => {
      setData({ loading: true });
      const result = await api(gameName);
      // console.log(gameName);
      const { ymData, games } = result;
      console.log("app");
      console.log(result);
      console.log(games);
      console.log(ymData);
      setData({ ymData, games, loading: false });
      // setData({ ymData, games, loading: false });
      // setGames({ data: games, loading: false });
      // setYmData({ data: ymData, loading: false });
      // console.log("effect");
      // onTextChange(gameName);
    })();
  }, [gameName]);

  if (data.loading) {
    return <p>loading</p>;
  }

  // console.log(data);
  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
  };
  const color = {
    axis: "#022D39",
  };
  console.log("app");
  console.log(data);
  // console.log(ymData);
  return (
    // <div className="has-background-grey-dark">
    <div>
      <Header />
      <Selector {...{ setGameName, games: data["games"] }} />
      <ZoomableLineChart
        {...{
          ymData: data["ymData"],
          width: 600,
          height: 400,
          margin,
          color,
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
