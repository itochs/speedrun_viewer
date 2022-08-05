import * as d3 from "d3";
import { axisBottom, zoom } from "d3";
import { useEffect, useRef, useState } from "react";

function ZoomableLineChart({ yearData, width, height, ymData }) {
  const svgRef = useRef();
  const [currentZoom, setCurrentZoom] = useState();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgContent = svg.select(".content");

    const xScale = d3
      .scaleLinear()
      .domain([0, ymData.length - 1])
      .range([0, width])
      .nice();

    if (currentZoom) {
      const newXScale = currentZoom.rescaleX(xScale);
      //   console.log(xScale.domain());
      //   console.log(newXScale.domain());
      xScale.domain(newXScale.domain());
    }

    // console.log(ymData);
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(ymData, (d) => d.len))
      .range([height, 0])
      .nice();

    // console.log(lineItem);
    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.len))
      .curve(d3.curveLinear);

    svgContent
      .selectAll(".myline")
      .data([ymData])
      .join("path")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("transform", "translate(50,0)")
      .attr("d", line);

    const xAxis = d3.axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(50, ${height})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    svg.select(".y-axis").attr("transform", `translate(50, 0)`).call(yAxis);

    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [50, 50],
        [width + 50, height + 50],
      ])
      .on("zoom", (event) => {
        // console.log("zoomed");
        // const zoomState = d3.zoomTransform(svg.node());
        const zoomState = event.transform;
        setCurrentZoom(zoomState);
        // console.log(zoomState);
        // console.log(event.transform);
      });

    svg.call(zoomBehavior);
  }, [currentZoom]);
  return (
    <>
      <div className="has-background-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width + 100} ${height + 100}`}
          transform={"translate(50,50)"}
        >
          {/* <rect x="100" y="100" width={100} height={100}></rect> */}
          <defs>
            <clipPath id="clip">
              <rect x={0} y={0} width={"100%"} height={"100%"} />
            </clipPath>
          </defs>
          <g className="content" clipPath="url(#clip)"></g>
          <g className="x-axis"></g>
          <g className="y-axis"></g>
        </svg>
      </div>
    </>
  );
}

function Chart({ data, width, height }) {
  console.log("chart");
  const yearData = data["yearData"];
  const runs = data["data"];
  //   console.log(runs);
  const ymData = yearData
    .map(({ year, month }) => {
      return month.map(({ month, len }) => {
        const ymd = runs.filter(({ submitted }) => {
          const date = new Date(submitted);
          return year == date.getFullYear() && month == date.getMonth();
        });
        //   return ymd.map(({ submitted }) => {
        //     const date = new Date(submitted);
        //     return {
        //       year: date.getFullYear(),
        //       month: date.getMonth(),
        //     };
        //   });
        return {
          year: year,
          month: month,
          len: ymd.length,
        };
      });
    })
    .flat();
  //   console.log(ymData);

  return (
    <>
      <h3>copy</h3>
      <ZoomableLineChart {...{ yearData, width, height, ymData }} />
    </>
  );
}

export default Chart;
