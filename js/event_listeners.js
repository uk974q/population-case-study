import {
  COMMON_STORE,
  filterData,
  showPopulationForTheYear,
} from "./common.js";
import ScatterPlot from "./visuals/scatter_plot.js";
import LineAreaChart from "./visuals/line_area_chart.js";

let ddElement = document.getElementById("yearSelectionDropdown");

LineAreaChart();
drawCharts(COMMON_STORE["years"][0]);

/* Event listener for dropdown selection of years */
ddElement.addEventListener("change", function (el) {
  drawCharts(el.target.value);
});

/* Filter data, draw the scatter plot and show the population */
function drawCharts(value) {
  filterData("" + value);
  ScatterPlot();
  showPopulationForTheYear(value);
}
