import { CONSTANTS } from "./const.js";

let store = {};
let years = new Set();
let ddElement = document.getElementById("yearSelectionDropdown");

/* Parse CSV data, create Object, calculate population for each year */
await fetch(CONSTANTS.POPULATION_API)
  .then((res) => res.text())
  .then((res) => {
    let data = res.split(/\r?\n/);
    let headerKeys = data[0].split(",");
    let responseObj = [];
    let popObject = {};
    for (let i = 1; i < data.length; i++) {
      let obj = {};
      data[i] = data[i].replace(/"([^"]*)"/g, (el, p) => p.replaceAll(",", ""));
      data[i] = data[i].replace(/\((-?\d+\.\d+)\)/, "-$1");
      let values = data[i].split(",");
      if (values[0] !== "") {
        headerKeys.forEach((el, i) => {
          let key = el.trim();
          obj[key] = values[i]?.trim();
        });
        years.add(+obj[CONSTANTS.YEAR]);
        responseObj.push(obj);
        if (popObject[obj[CONSTANTS.YEAR]]) {
          popObject[obj[CONSTANTS.YEAR]] += +obj[CONSTANTS.POPULATION];
        } else {
          popObject[obj[CONSTANTS.YEAR]] = +obj[CONSTANTS.POPULATION];
        }
      }
    }
    store["totalPopulationObj"] = popObject;
    store["totalPopulationData"] = Object.entries(popObject);
    store["totalPopulationExtent"] = d3.extent(Object.values(popObject));
    store["years"] = Array.from(years).sort();
    store["years"].forEach((el) => {
      let option = document.createElement("option");
      option.value = el;
      option.text = el;
      ddElement.add(option);
    });
    store["data"] = responseObj;
  });

/* Filter data based on the year selected. Calculate the extents of KPIs */
function filterData(year = "1950") {
  let regions = new Set();
  let populationGrowthExtent = [0, 0];
  let populationDensityExtent = [0, 0];
  let populationExtent = [0, 0];
  let firstFlagCheck = true;
  store["filteredData"] = store.data.filter((el, i) => {
    if (el[CONSTANTS.YEAR] === year) {
      if (
        +el[CONSTANTS.POPULATION_DENSITY] > 800 ||
        +el[CONSTANTS.POPULATION_GROWTH] < -100 ||
        +el[CONSTANTS.POPULATION_GROWTH] > 100
      ) {
        return;
      }
      regions.add(el[CONSTANTS.REGION]);
      if (firstFlagCheck) {
        populationGrowthExtent[0] = el[CONSTANTS.POPULATION_GROWTH];
        populationDensityExtent[0] = el[CONSTANTS.POPULATION_DENSITY];
        populationExtent[0] = el[CONSTANTS.POPULATION];
        firstFlagCheck = false;
      } else {
        calculateExtent(
          el,
          populationGrowthExtent,
          CONSTANTS.POPULATION_GROWTH
        );
        calculateExtent(
          el,
          populationDensityExtent,
          CONSTANTS.POPULATION_DENSITY
        );
        calculateExtent(el, populationExtent, CONSTANTS.POPULATION);
      }
      return el;
    }
  });
  function calculateExtent(el, arr, key) {
    if (+el[key] < arr[0]) {
      arr[0] = +el[key];
    }
    if (+el[key] > arr[1]) {
      arr[1] = +el[key];
    }
  }
  store["populationGrowthExtent"] = populationGrowthExtent;
  store["populationDensityExtent"] = populationDensityExtent;
  store["populationExtent"] = populationExtent;
  store["regions"] = Array.from(regions);
}

/* Display purpose for the cards */
function showPopulationForTheYear(year) {
  let value = store["totalPopulationObj"][year];
  document.querySelector(".text-year").textContent = "(" + year + ")";
  document.querySelector(".info-count").textContent = d3.format(".2s")(+value);
}

export { store as COMMON_STORE, filterData, showPopulationForTheYear };
