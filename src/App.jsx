import "bulma/css/bulma.css";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import Axis from "./Axis";

function ZoomableSVG({ children, width, height, xScale, line, pathRef }) {
  // console.log("ZoomableSVG");
  const svgRef = useRef();
  // const extent = [
  //   [0, 0],
  //   [width, height],
  // ];
  // useEffect(() => {
  //   const zoom = d3
  //     .zoom()
  //     .scaleExtent([1, 32])
  //     .extent([
  //       [0, 0],
  //       [500, 500],
  //     ])
  //     .translateExtent([
  //       [0, -100],
  //       [500, -100],
  //     ])
  //     // .translateExtent(extent)
  //     // .extent(extent)
  //     .on("zoom", (event) => {
  //       // extent = d3.event.selection;
  //       // console.log(extent);
  //       const { x, y, k } = event.transform;
  //       xScale
  //         .domain(event.transform.rescaleX(xScale).domain())
  //         .range([0, 400].map((d) => event.transform.applyX(d)));
  //       // d3.select(pathRef.current).attr("d", line);
  //     });
  //   d3.select(svgRef.current).call(zoom);

  //   // const brush = d3
  //   //   .brushX()
  //   //   .extent([
  //   //     [0, 0],
  //   //     [400, 400],
  //   //   ])
  //   //   .on("end", (event) => {
  //   //     extent = event.selection;
  //   //     if (extent) {
  //   //       xScale.domain([xScale.invert(extent[0]), xinvert(extent[1])]);
  //   //       d3.select(svgRef.current).call(brush.move, null);
  //   //     }
  //   //   });
  //   // d3.select(svgRef.current).call(brush);
  // }, []);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${width + 100} ${height + 100}`}>
      <g>{children}</g>
    </svg>
  );
}

function TrendChartContent({ line, lineItem, xTicks, yTicks }) {
  console.log("ChartContent");
  const [hovered, setHovered] = useState(-1);
  return (
    <g transform="translate(50, 50)">
      <g>
        <path
          className="path"
          d={line(lineItem.new)}
          fill={"none"}
          stroke={"blue"}
          strokeWidth={"2"}
          opacity={0.5}
        />
        <path
          className="path"
          d={line(lineItem.all)}
          fill={"none"}
          stroke={"black"}
          strokeWidth={"3"}
          opacity={0.5}
        />
      </g>
      <g>
        {lineItem.all.map((item, index) => {
          return (
            <g key={index} transform={`translate(${item.x}, 0)`}>
              <title>提出数 : {item.ylabel}</title>
              <rect
                x={0}
                y={0}
                width={2}
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
                <circle x={0} y={0} r={5} stroke={"red"} fill={"red"} />
              </g>
            </g>
          );
        })}
      </g>
      <Axis {...{ xTicks, yTicks }} />
    </g>
  );
}

function TrendChart(props) {
  const yearData = props["yearData"];

  const xScale = d3
    .scaleLinear()
    .domain([0, yearData.length * 12])
    .range([0, 400])
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
    .range([400, 0])
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
    <ZoomableSVG
      width={400}
      height={400}
      xScale={xScale}
      line={line}
      pathRef={pathRef}
    >
      <TrendChartContent {...{ line, lineItem, xTicks, yTicks }} />
    </ZoomableSVG>
  );
}

function Header() {
  return (
    <>
      <header className="hero is-dark is-bold">
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
      <footer className="footer">
        <div className="content has-text-centered">
          <p>this is footer</p>
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
    <div>
      <Header />
      <TrendChart {...data} />
      <Footer />
    </div>
    // </Suspense>
  );
}

export default App;
