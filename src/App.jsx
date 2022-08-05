import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import Axis from "./Axis";
import Chart from "./Chart";

function ZoomableSVG({
  children,
  width,
  height,
  xScale,
  line,
  lineItem,
  xTicks,
  yTicks,
}) {
  console.log("ZoomableSVG");
  const svgRef = useRef();
  // const extent = [
  //   [0, 0],
  //   [width, height],
  // ];
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [k, setK] = useState(1);
  const [zoomState, setZoomState] = useState();

  if (zoomState) {
    const newXScale = zoomState.rescaleX(xScale);
    // console.log(newXScale.domain());
    // console.log(xScale.domain());
  }

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const zoom = d3
      .zoom()
      .scaleExtent([1, 3])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        // console.log(xScale(12));
        const { x, y, k } = event.transform;
        setX(x);
        setY(y);
        setK(k);
        const zoomCurrentState = d3.ZoomTransform(svg.node());
        console.log(zoomCurrentState);
        // console.log(event.transform);
        // setZoomState(event.transform.rescaleX());
        // xScale.range([0, width].map((d) => event.transform.applyX(d)));
        // console.log(line);
        // d3.select(".path-new").attr(`translate(${x}, ${y})`);
      });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${width + 100} ${height + 100}`}>
      <g transform={`translate(${x}, ${y}) scale(${k})`}>{children}</g>
    </svg>
  );
}

function TrendChartContent({ line, lineItem, xTicks, yTicks, width, height }) {
  console.log("ChartContent");
  const [hovered, setHovered] = useState(-1);
  return (
    <g>
      <Axis {...{ xTicks, yTicks, width, height }} />
      <g className="paths">
        <path
          className="path-new"
          d={line(lineItem.new)}
          fill={"none"}
          stroke={"white"}
          strokeWidth={"1"}
          opacity={0.8}
          clipPath={"url(#clip)"}
        />
        <path
          className="path-all"
          d={line(lineItem.all)}
          fill={"none"}
          stroke={"gray"}
          strokeWidth={"1"}
          opacity={0.8}
          clipPath={"url(#clip)"}
        />
      </g>
      <g className="tooltip-rects">
        {lineItem.all.map((item, index) => {
          return (
            <g key={index} transform={`translate(${item.x}, 0)`}>
              <title>提出数 : {item.ylabel}</title>
              <rect
                x={-2}
                y={0}
                width={4}
                height={height}
                fill={"red"}
                opacity={index === hovered ? 0.5 : 0}
                onMouseOver={() => {
                  setHovered(index);
                }}
                onMouseOut={() => {
                  setHovered(-1);
                }}
              />
              <g
                transform={`translate(0, ${item.y})`}
                opacity={index === hovered ? 1 : 0}
              >
                <circle
                  x={0}
                  y={0}
                  r={3}
                  stroke={"red"}
                  fill={"red"}
                  opacity={0.5}
                />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
}

function TrendChart({ data, width, height }) {
  const yearData = data["yearData"];

  const xScale = d3
    .scaleLinear()
    .domain([0, yearData.length * 12])
    .range([0, width])
    .nice();
  const lenData = yearData
    .map((item) => {
      return item["month"].map((mitem) => {
        return mitem["len"];
      });
    })
    .flat();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(lenData))
    .range([height, 0])
    .nice();
  const lineItem = {
    all: yearData
      .map((item, index) => {
        return item["month"].map((mitem, mindex) => {
          return {
            x: xScale(index * 12 + mindex),
            y: yScale(mitem["len"]),
            ylabel: mitem["len"],
          };
        });
      })
      .flat(),
    new: yearData
      .map((item, index) => {
        return item["month"].map((mitem, mindex) => {
          return {
            x: xScale(index * 12 + mindex),
            y: yScale(mitem["newbielen"]),
            ylabel: mitem["newbielen"],
          };
        });
      })
      .flat(),
  };
  const line = d3
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .curve(d3.curveLinear);
  const xTicks = yearData.map((item, index) => {
    return {
      x: xScale(index * 12),
      label: item["year"],
    };
  });
  const yTicks = yScale.ticks().map((y) => {
    return {
      y: yScale(y),
      label: y,
    };
  });

  return (
    <g>
      <rect
        className="zoom-panel"
        x={0}
        y={0}
        width={width}
        height={height}
        fill={"green"}
        opacity={0.5}
      ></rect>
      <ZoomableSVG
        {...{ width, height, xScale, line, lineItem, xTicks, yTicks }}
      >
        <svg width="0" heght="0">
          <defs>
            <clipPath id="clip">
              <rect x={0} y={0} width={width} height={height}></rect>
            </clipPath>
          </defs>
        </svg>
        <TrendChartContent
          {...{ line, lineItem, xTicks, yTicks, width, height }}
        />
      </ZoomableSVG>
    </g>
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

  return (
    // <Suspense fallback={<p>loading</p>}>
    <div className="has-background-grey-dark">
      {/* <Header />
      <TrendChart {...{ data, width: 600, height: 300 }} />
      <Footer /> */}
      <Chart {...{ data, width: 600, height: 300 }} />
    </div>
    // </Suspense>
  );
}

export default App;
