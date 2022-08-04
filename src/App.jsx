import { useEffect, useState } from "react";
import * as d3 from "d3";
import api from "./api";
import { svg } from "d3";

function TrendChart(data) {
  const yearData = data["yearData"];
  const xScale = d3
    .scaleLinear()
    .domain([0, yearData.length - 1])
    .range([0, 400])
    .nice();
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yearData, (item) => item["len"]))
    .range([400, 0])
    .nice();
  const lineItem = yearData.map((item, index) => {
    return { label: xScale(index), value: yScale(item["len"]) };
  });
  const line = d3
    .line()
    .x((d) => d.label)
    .y((d) => d.value)
    .curve(d3.curveLinear);
  const xTicks = yearData.map((item, index) => {
    return {
      x: xScale(index),
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
    <svg viewBox="0 0 500 500">
      <g>
        <g transform="translate(50, 50)">
          <path
            d={line(lineItem)}
            fill={"none"}
            stroke={"black"}
            strokeWidth={"3"}
          />
        </g>
        <g className="y-axis" transform="translate(50, 50)">
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={400}
            stroke={"black"}
            strokeWidth={1}
          />
          {yTicks.map((tick, index) => {
            return (
              <g key={index} transform={`translate(0, ${tick.y})`}>
                <line x1={0} y1={0} x2={-5} y2={0} stroke={"black"} />
                <text
                  x={-10}
                  y={0}
                  fontSize={12}
                  textAnchor={"end"}
                  dominantBaseline={"middle"}
                  style={{ userSelect: "none" }}
                >
                  {tick.label}
                </text>
              </g>
            );
          })}
        </g>
        <g className="x-axis" transform="translate(50, -50)">
          <line
            x1={0}
            y1={500}
            x2={500}
            y2={500}
            stroke={"black"}
            strokeWidth={1}
          />
          <g className="x-axis-label">
            {xTicks.map((tick, index) => {
              return (
                <g key={index} transform={`translate(${tick.x}, 500)`}>
                  <line x1={0} y1={0} x2={0} y2={5} stroke={"black"} />
                  <text
                    x={0}
                    y={10}
                    fontSize={12}
                    textAnchor={"middle"}
                    dominantBaseline={"hanging"}
                    style={{ userSelect: "none" }}
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </g>
    </svg>
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
        <TrendChart {...{ yearData }} />
        {/* <StackChart /> */}
      </div>
    </div>
    // </Suspense>
  );
}

export default App;
