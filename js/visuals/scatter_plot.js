import { COMMON_STORE } from "../common.js";

function ScatterPlot() {
  document.getElementById("graph").innerHTML = "";
  let config = {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  };
  const svgContainer = document.querySelector(".box");
  const containerRect = svgContainer.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;
  let x_domain = [0, 800];
  let y_domain = [-100, 100];
  let bubble_domain = COMMON_STORE["populationExtent"];
  let regionDomain = COMMON_STORE["regions"];
  let colorDomain = d3
    .scaleOrdinal()
    .domain(regionDomain)
    .range(["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300"])
    .unknown("whitesmoke");

  let bubbleScale = d3.scaleLinear().domain(bubble_domain).range([5, 15]);

  let svg = d3
    .select(".box")
    .append("svg")
    .attr("width", width)
    .attr("height", height + config.marginTop + config.marginBottom)
    .append("g")
    .attr(
      "transform",
      `translate(${config.marginLeft + config.marginRight},${
        config.marginBottom + config.marginTop
      })`
    );

  let x = d3
    .scaleLinear()
    .domain(x_domain)
    .range([0, width - config.marginLeft - config.marginRight - 50])
    .nice();

  let y = d3
    .scaleLinear()
    .domain(y_domain)
    .range([height - config.marginTop - config.marginBottom - 50, 0])
    .nice();

  d3.select("body")
    .append("div")
    .attr("class", "tooltip-country")
    .style("display", "none")
    .style("position", "absolute");

  let tooltlip = d3.select("body").select(".tooltip-country");

  let xAxis = d3
    .axisBottom(x)
    .ticks(8)
    .tickPadding(8)
    .tickFormat((d) => (d >= 800 ? ">800" : d));

  let yAxis = d3.axisLeft(y).ticks(8).tickPadding(8);

  svg
    .append("g")
    .attr("class", "x-axis-tick")
    .attr(
      "transform",
      `translate(0,${height - config.marginBottom - config.marginTop - 50})`
    )
    .call(xAxis);

  svg.append("g").attr("class", "y-axis-tick").call(yAxis);

  svg
    .selectAll("circle")
    .data(COMMON_STORE["filteredData"])
    .enter()
    .append("circle")
    .attr("class", "scatter-circles cursor-pointer")
    .attr("region", (d) => d["Region"])
    .attr(
      "value",
      (d) =>
        `${+d["Population_Density"]}${+d["Population_Growth_Rate"]}${+d[
          "Population (000s)"
        ]}`
    )
    .attr(
      "cx",
      (d) => x(+d["Population_Density"]) + bubbleScale(+d["Population (000s)"])
    )
    .attr(
      "cy",
      (d) =>
        y(+d["Population_Growth_Rate"]) - bubbleScale(+d["Population (000s)"])
    )
    .attr("r", (d) => bubbleScale(+d["Population (000s)"]))
    .attr("fill", (d) => colorDomain(d["Region"]))
    .on("mouseover", function (event, d) {
      d3.selectAll(".scatter-circles").attr("opacity", 0.1);
      d3.selectAll(".legend-entry").attr("opacity", 0.1);
      d3.select(this).attr("opacity", 1);
      d3.select(`.legend-entry[region="${d["Region"]}"]`).attr("opacity", 1);
      tooltlip
        .style("display", "block")
        .html(function () {
          return `<div class="tooltip-info">
                    <div class="country">Country : <span class="country-value">${
                      d["Country"]
                    }, ${d["Region"]}</span></div>
                    <div class="country">Population : <span class="country-value">${d3.format(
                      ".2s"
                    )(d["Population (000s)"])}</span></div>
                    <div class="country">Population Density : <span class="country-value">${
                      d["Population_Density"]
                    }</span></div>
                    <div class="country">Population Growth : <span class="country-value">${
                      d["Population_Growth_Rate"]
                    }</span></div>
                </div>`;
        })
        .transition()
        .duration(50)
        .style("left", function () {
          if (event.pageX > width / 2) {
            return (
              event.pageX -
              d3.select(".tooltip-country").node().getBoundingClientRect()
                .width -
              15 +
              "px"
            );
          } else {
            return event.pageX + 15 + "px";
          }
        })
        .style("top", event.pageY + "px");
    })
    .on("mouseout", function () {
      d3.selectAll(".scatter-circles").attr("opacity", 1);
      d3.selectAll(".legend-entry").attr("opacity", 1);
      tooltlip.style("display", "none");
    });

  const legendGroup = svg
    .append("g")
    .attr("class", "legend-group")
    .attr("transform", `translate(${config.marginLeft},${height - 30})`);

  const legendEntries = legendGroup
    .selectAll(".legend-entry")
    .data(COMMON_STORE["regions"])
    .enter()
    .append("g")
    .attr("class", "legend-entry cursor-pointer")
    .attr("region", (d) => d)
    .attr("transform", (d, i) => {
      if (width < 500 && i > 2) {
        return `translate(${(i - 3) * 100}, 20)`;
      }
      return `translate(${i * 100}, 0)`;
    })
    .on("mouseover", function (el, d) {
      d3.selectAll(".scatter-circles").attr("opacity", 0.1);
      d3.selectAll(".legend-entry").attr("opacity", 0.1);
      d3.select(this).attr("opacity", 1);
      d3.selectAll(`.scatter-circles[region="${d}"]`).attr("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".legend-entry").attr("opacity", 1);
      d3.selectAll(".scatter-circles").attr("opacity", 1);
    });

  legendEntries
    .append("text")
    .text((d) => (d === "#N/A" ? "Unknown" : d))
    .attr("x", 15)
    .attr("y", function () {
      return 5;
    })
    .attr("y", function () {
      return 5;
    })
    .style("font-size", "12px");

  legendEntries
    .append("circle")
    .attr("cx", 0)
    .attr("y", function () {
      return 5;
    })
    .attr("r", 7.5)
    .attr("fill", (d, i) => colorDomain(d));
}

export default ScatterPlot;
