function parseData(data) {
  return data.map((item) => {
    item["submitted"] = new Date(item["submitted"]);
    return item;
  });
}

// async function getRunData() {
//   const rundata = [];
//   const max = 200;
//   let offset = 0;
//   while (rundata.length % max == 0 && rundata.length <= offset) {
//     const runRes = await fetch(
//       `https://www.speedrun.com/api/v1/runs?game=m1z3w2d0&orderby=verify-date&max=${max}&offset=${offset}`
//     );
//     const runResJson = await runRes.json();
//     rundata.push(...runResJson["data"]);
//     offset += max;
//   }
//   return rundata;
// }

function getPlayers(data) {
  const players = data
    .map((item) => item["players"].map((info) => info["id"]))
    .flat();
  return new Set(players);
}

function getYearData(data, players) {
  const years = [
    ...new Set(
      data.map((item) => {
        return item["submitted"].getFullYear();
      })
    ),
  ];
  const oldPlayers = getPlayers(
    data.filter((item) => {
      return (
        item["submitted"].getFullYear() === years[0] &&
        item["submitted"].getMonth() < 3
      );
    })
  );
  console.log(oldPlayers);
  const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const runData = years.map((year) => {
    const yearData = data.filter((item) => {
      return item["submitted"].getFullYear() === year;
    });

    return {
      year,
      len: yearData.length,

      month: month.map((m) => {
        const monthData = yearData.filter((item) => {
          return item["submitted"].getMonth() === m - 1;
        });
        console.log("month");
        // console.log(monthData);
        // console.log(yearData);
        const newbie = monthData
          .map((item) => {
            const nothave = item.players.filter(({ id }) => {
              // console.log(id);
              return !oldPlayers.has(id);
            });
            // console.log(nothave);
            return nothave;
          })
          .flat();

        // console.log("new");
        // console.log(newbie);
        // console.log("newbie");
        // console.log(newbie);
        newbie.forEach(({ id }) => {
          oldPlayers.add(id);
          // console.log(id);
        });

        return {
          month: m,
          len: monthData.length,
          newbielen: newbie.length,
          data: monthData,
          // date: monthData[0]["submitted"],
          // len: monthData.length,
        };
      }),
    };
  });
  // console.log(oldPlayers);
  // console.log(players);
  // console.log([...oldPlayers] == [...players]);
  console.log(runData);
  return runData;
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
    rundata.push(
      ...runResJson["data"].filter((item) => item["submitted"] != null)
    );
    offset += max;
  }
  const data = parseData(rundata);
  const players = getPlayers(data);
  const yearData = getYearData(data, players);
  // console.log("year data");
  // console.log(yearData);

  return { data, players, yearData };
}
