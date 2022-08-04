import { useEffect, useState } from "react";
import * as d3 from "d3";
import api from "./api";

function TrendChart(data) {
  const yearData = data["yearData"];
  const xScale = d3
    .scaleLinear()
    .domain([0, yearData.length])
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
  // .curve(d3.curveBasis);
  console.log("trend chart");
  console.log(yearData);
  return (
    <svg viewBox="0 0 400 400">
      <g>
        {/* <rect x={10} y={10} width={100} height={100} /> */}
        <g>
          {yearData.map((item, index) => {
            console.log(yScale(item["len"]));
            console.log(item["len"]);
            return (
              <g>
                {/* <rect
                  key={index}
                  x={xScale(index)}
                  y={yScale(item["len"])}
                  width={10}
                  height={400 - yScale(item["len"])}
                  fill={"red"}
                /> */}
                <path
                  d={line(lineItem)}
                  fill={"none"}
                  stroke={"black"}
                  strokeWidth={"3"}
                />
              </g>
            );
          })}
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
