import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import Axis from "./Axis";
import { text } from "d3";

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
  return (
    <g>
      <Axis {...{ xTicks, yTicks }} />
    </g>
  );
}

function TrendChart(props) {
  // console.log(props);
  // console.log(props["data"]);
  const yearData = props["yearData"];
  const runData = props["data"];
  // console.log(yearData);

  const xScale = d3
    .scaleLinear()
    .domain([0, (yearData.length - 1) * 12])
    .range([0, 400])
    .nice();
  const lenData = yearData
    .map((item) => {
      return item["month"].map((mitem) => {
        return mitem["len"];
      });
    })
    .flat();
  console.log(lenData);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(lenData))
    .range([400, 0])
    .nice();
  // console.log(yScale);
  const lineItem = yearData
    .map((item, index) => {
      // return { x: xScale(index), y: yScale(item["len"]) };
      return item["month"].map((mitem, mindex) => {
        return {
          x: xScale(index * 12 + mindex),
          y: yScale(mitem["len"]),
        };
      });
    })
    .flat();
  // console.log("line item");
  console.log("line item");
  console.log(lineItem);
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
  // return <svg id="chart" ref={svgRef} viewBox="0 0 500 500"></svg>;
  return (
    <ZoomableSVG
      width={400}
      height={400}
      xScale={xScale}
      line={line}
      pathRef={pathRef}
    >
      <TrendChartContent {...{ line, lineItem, xTicks, yTicks }} />
      <g transform="translate(50, 50)">
        <circle x={400} y={200} r={20} stroke={"red"} fill={"red"} />
        <g>
          <path
            ref={pathRef}
            className="path"
            d={line(lineItem)}
            fill={"none"}
            stroke={"black"}
            strokeWidth={"3"}
          />
        </g>
        <g>
          {lineItem.map((item, index) => {
            let over = false;
            return (
              <g key={index}>
                <title>{item.x}</title>
                <rect
                  key={index}
                  x={item.x}
                  y={0}
                  width={4}
                  height={400}
                  fill={"red"}
                  opacity={0}
                  onMouseOver={(event) => {
                    over = true;
                  }}
                />
                <circle x={item.x} y={0} r={5} stroke={"red"} fill={"red"} />
              </g>
            );
          })}
        </g>
        <circle x={100} y={0} r={20} stroke={"red"} fill={"red"} />
        <Axis {...{ xTicks, yTicks }} />
      </g>
    </ZoomableSVG>
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
  // console.log(data);
  const graphWidth = 600;
  const graphHeight = 600;
  console.log("api");
  console.log(data);

  const { rundata, players, yearData } = data;
  // console.log(data["yearData"]);
  return (
    // <Suspense fallback={<p>loading</p>}>
    <div>
      <h1>Hello, World!</h1>
      <div>
        <TrendChart {...data} />
        {/* <StackChart /> */}
      </div>
    </div>
    // </Suspense>
  );
}

export default App;
