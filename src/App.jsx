import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import Axis from "./Axis";

function ZoomableSVG({ children, width, height }) {
  console.log("ZoomableSVG");
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const svgRef = useRef();
  useEffect(() => {
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        setK(k);
        setX(x);
        setY(y);
      });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} viewBox={`0 0 ${width + 100} ${height + 100}`}>
      <g transform={`translate(${x}, 0) scale(${k})`}>{children}</g>
    </svg>
  );
}

function TrendChartContent({ widht, height, runData, yearData }) {
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
  // console.log(lineItem);
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
  console.log("ChartContent");
  return (
    <g>
      <g transform="translate(50, 50)">
        <path
          d={line(lineItem)}
          fill={"none"}
          stroke={"black"}
          strokeWidth={"3"}
        />
      </g>
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

  // return <svg id="chart" ref={svgRef} viewBox="0 0 500 500"></svg>;
  return (
    <ZoomableSVG width={400} height={400}>
      <TrendChartContent
        width={400}
        height={400}
        runData={runData}
        yearData={yearData}
      />
    </ZoomableSVG>
  );
}

function StackChart() {
  <svg viewBox="0 0 600 600">
    <g transform="translate(10 0)">
      {data.map((item, i) => {
        // console.log(yScale(i));
        return (
          <rect
            key={i}
            x={xScale(i)}
            y={yScale(item["len"])}
            width={50}
            height={graphHeight - yScale(item["len"])}
            fill="pink"
          />
        );
      })}
    </g>
  </svg>;
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
  // const runData = parseData(data);
  // console.log(JSON.stringify(runData, null, 1));
  // const xScale = d3
  //   .scaleLinear()
  //   .domain([0, data.length])
  //   .range([0, graphWidth])
  //   .nice();
  // const yScale = d3
  //   .scaleLinear()
  //   .domain(d3.extent(data, (item) => item["len"]))
  //   .range([graphHeight, 0])
  //   .nice();

  /*
      To see how stack.value can be used, consider a dataset formatted as follows:
  
  var data = [
    {month: new Date(2018, 1, 1), fruitSales: {apples: 10, bananas: 20, oranges: 15}},
    ...
  To create a stack generator with this dataset we call d3.stack and then set the keys to the names of the fruits as we did in the previous examples. We then call stack.value, passing it a lambda expression. The lambda expression has two parameters, obj and key, which correspond to an object in data and a key passed to stack.keys, respectively, and returns the value associated with the key in the object obj.
  
  var stack = d3.stack()
    .keys(["apples", "bananas", "oranges"])
    .value((obj, key) => obj.fruitSales[key]); 
      */
  //   const subgroups = Object.keys(data[0]["month"]);
  //   console.log("subgrounp");
  //   console.log(subgroups);
  //   // const stackedData = d3.stack().keys(subgroups)(data)
  //   const stackedData = d3.stack().keys(subgroups)(
  //     data.map((item) => item["month"])
  //   );
  //   // .value((data, key) => data["month"][key]);
  //   console.log("stack");
  //   console.log(stackedData);

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
