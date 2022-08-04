function parseData(data) {
  //   console.log("parse");
  return data.map((item) => {
    return (item["submitted"] = new Date(item["submitted"]));
  });
}

async function getRunData() {
  const rundata = [];
  const max = 200;
  let offset = 0;
  while (rundata.length % max == 0 && rundata.length <= offset) {
    const runRes = await fetch(
      `https://www.speedrun.com/api/v1/runs?game=m1z3w2d0&orderby=verify-date&max=${max}&offset=${offset}`
    );
    const runResJson = await runRes.json();
    // console.log(runResJson["data"]);
    rundata.push(...runResJson["data"]);
    offset += max;
  }
  //   console.log("rundata");
  //   console.log(rundata);
  return rundata;
}

function getPlayers(data) {
  const players = data
    .map((item) => item["players"].map((info) => info["id"]))
    .flat();
  //   console.log(players);
  //   console.log(new Set(players));
  return players;
}

function getYearData(data) {
  console.log("year data");
  //   console.log(data);
  //   console.log(data[300]["submitted"]);
  const years = [
    ...new Set(
      data.map((item) => {
        // return new Date(item["submitted"]).getFullYear();
        return item["submitted"].getFullYear();
      })
    ),
  ];
  console.log(years);
  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const runData = years.map((year) => {
    const yearData = data.filter((item) => {
      // const date = new Date(item["submitted"]);
      return item["submitted"].getFullYear() === year;
    });
    //   return {
    //     year,
    //     len: yearData.length,
    //     months: month.map((m) => {
    //       const monthData = yearData.filter((item) => {
    //         // console.log(item["run"]["status"]["verify-date"]);
    //         const date = new Date(item["run"]["status"]["verify-date"]);
    //         // console.log();
    //         return date.getMonth() === m - 1;
    //       });
    //       return {
    //         month: m,
    //         len: monthData.length,
    //         data: monthData,
    //       };
    //     }),
    //   };
  });
}

export default async function api() {
  const rundata = [];
  const max = 200;
  let offset = 0;
  while (rundata.length % max == 0 && rundata.length <= offset) {
    const runRes = await fetch(
      `https://www.speedrun.com/api/v1/runs?game=m1z3w2d0&orderby=verify-date&max=${max}&offset=${offset}`
    );
    const runResJson = await runRes.json();
    // console.log(runResJson["data"]);
    rundata.push(
      ...runResJson["data"].filter((item) => item["submitted"] != null)
    );
    offset += max;
  }
  console.log("rundata");
  //   console.log(rundata);
  //   const data = getRunData();
  const data = parseData(rundata);
  const players = getPlayers(rundata);
  const yearData = getYearData(rundata);
  return { rundata, players, yearData };
}
