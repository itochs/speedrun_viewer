import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import Axis from "./Axis";

function ZoomableSVG({ children, width, height, xScale, line, lineItem }) {
  console.log("ZoomableSVG");
  const svgRef = useRef();
  const extent = [
    [0, 0],
    [width, height],
  ];
  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      // extent = d3.event.selection;
      // console.log(extent);
      const { x, y, k } = event.transform;
      // console.log(event.transform);
      // xScale
      //   .domain(event.transform.rescaleX(xScale).domain())
      //   .range([0, 400].map((d) => event.transform.applyX(d)));
      // d3.select(pathRef.current).attr("d", line);
    });
    const defs = d3
      .select(svgRef.current)
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", 50)
      .attr("width", width)
      .attr("height", height);
    d3.select(svgRef.current).call(zoom.transform, d3.zoomIdentity);
  }, []);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${width + 100} ${height + 100}`}>
      <g transform="translate(50, 50)">
        {children}
        <g className="paths">
          <path
            className="path-newn"
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
          />
        </g>
      </g>
    </svg>
  );
}

function TrendChartContent({ line, lineItem, xTicks, yTicks, width, height }) {
  console.log("ChartContent");
  const [hovered, setHovered] = useState(-1);
  return (
    <g>
      <Axis {...{ xTicks, yTicks, width, height }} />

      <g className="tooltip-rects">
        {lineItem.all.map((item, index) => {
          return (
            <g key={index} transform={`translate(${item.x}, 0)`}>
              <title>提出数 : {item.ylabel}</title>
              <rect
                x={-2}
                y={0}
                width={4}
                height={400}
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

  const pathRef = useRef();
  return (
    <g>
      <ZoomableSVG {...{ width, height, xScale, line, lineItem }}>
        <TrendChartContent
          {...{ line, lineItem, xTicks, yTicks, width, height }}
        />
        <g>
          <rect x={100} y={100} width={100} height={100}></rect>
        </g>
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
      <Header />
      <TrendChart {...{ data, width: 600, height: 300 }} />
      <Footer />
    </div>
    // </Suspense>
  );
}

export default App;
