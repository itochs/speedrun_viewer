import { useEffect, useState } from "react";
import * as d3 from "d3";

function parseData(data) {
  // console.log("------ get run data");
  // console.log(JSON.stringify(data, null, 1));
  const runs = data["data"]["runs"];
  const sortruns = d3
    .sort(runs, (d) => new Date(d["run"]["status"]["verify-date"]))
    .filter((item) => item["run"]["status"]["verify-date"] !== null);
  const years = [
    ...new Set(
      sortruns.map((item) => {
        return new Date(item["run"]["status"]["verify-date"]).getFullYear();
      })
    ),
  ];

  console.log(sortruns);
  const players = sortruns
    .map((item) => item["run"]["players"].map((info) => info["id"]))
    .flat();
  console.log(players);
  console.log(new Set(players));
  // console.log(only);
  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const runData = years.map((year) => {
    const yearData = sortruns.filter((item) => {
      const date = new Date(item["run"]["status"]["verify-date"]);
      return date.getFullYear() === year;
    });
    return {
      year,
      len: yearData.length,
      months: month.map((m) => {
        const monthData = yearData.filter((item) => {
          // console.log(item["run"]["status"]["verify-date"]);
          const date = new Date(item["run"]["status"]["verify-date"]);
          // console.log();
          return date.getMonth() === m - 1;
        });
        return {
          month: m,
          len: monthData.length,
          data: monthData,
        };
      }),
    };
  });
  // console.log(data);
  console.log(runData);
  return runData;
}

function TrendChart(data) {
  // console.log(props);
  // console.log(data);
  return (
    <svg viewBox="0 0 400 400">
      <g>
        <rect x={10} y={10} width={100} height={100} />
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
      // const response = await fetch(
      //   "https://www.speedrun.com/api/v1/leaderboards/smw/category/96_Exit"
      // );
      // run
      const rundata = [];
      const max = 200;
      let offset = 0;
      while (rundata.length % max == 0 && rundata.length <= offset) {
        const runRes = await fetch(
          `https://www.speedrun.com/api/v1/runs?game=m1z3w2d0&orderby=verify-date&max=200&offset=${offset}`
        );
        const runResJson = await runRes.json();
        // console.log(runResJson["data"]);
        rundata.push(...runResJson["data"]);
        offset += max;
      }

      // console.log(JSON.stringify(runResJson, null, 1));
      // console.log(rundata);
      const players = rundata
        .map((item) => item["players"].map((info) => info["id"]))
        .flat();
      console.log(players);
      console.log(new Set(players));
      // game res
      // const gameRes = await fetch(
      //   "https://www.speedrun.com/api/v1/games?max=1000&_bulk=yes&name=mario&orderby=similarity"
      // );
      // const gameResJson = await gameRes.json();
      // console.log(JSON.stringify(gameResJson, null, 1));
      // console.log(
      //   gameResJson["data"]
      //     .map((item) => {
      //       // if (item["names"]["japanese"] != null) {
      //       return item["names"];
      //       // }
      //     })
      //     .filter((item) => item["japanese"] != null)
      // );
      // console.log(gameResJson["data"][33]);
      // if (!response.ok) {
      //   throw new Error("Network response was not ok.");
      // }

      // setData(resJson);
    })();
  }, []);

  if (data == null) {
    return <p>loading</p>;
  }
  // console.log(data);
  const graphWidth = 600;
  const graphHeight = 600;
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

  return (
    // <Suspense fallback={<p>loading</p>}>
    <div>
      <h1>Hello, World!</h1>
      <div>
        <TrendChart {...{ data }} />
        {/* <StackChart /> */}
      </div>
    </div>
    // </Suspense>
  );
}

export default App;
