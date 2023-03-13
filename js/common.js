const POPULATION_GROWTH ="Population_Growth_Rate"
const POPULATION_DENSITY ="Population_Density"
const POPULATION ="Population (000s)"
const YEAR = "Year"
const REGION = "Region"
var store = {}
let years =  new Set()
let ddElement = document.getElementById("yearSelectionDropdown")
await fetch('population_continents.csv').then(res => res.text())
.then(res => {
    let data = res.split(/\r?\n/)
    // console.log(res)
    let headerKeys = data[0].split(',')
    let responseObj = []
    let popObject = {}
    for(let i=1; i<data.length; i++){
        let obj = {}
        // if(i == 4537){
        //     debugger
        //     console.log("Hello")
        // }
        data[i] = data[i].replace(/"([^"]*)"/g, (el,p) => p.replaceAll(",",""))
        data[i] = data[i].replace( /\((-?\d+\.\d+)\)/, "-$1");
        let values = data[i].split(",")
        if(values[0] !== ""){
            
            headerKeys.forEach((el,i) => {
                let key = el.trim()
                // console.log("Values",values[i])
                obj[key] = values[i]?.trim()
            })
            // if(isNaN(+obj[YEAR])){
            //     debugger
            // }
            years.add(+obj[YEAR])
            responseObj.push(obj)
            // if(obj['Country'] == 'China'){
            //     debugger
            //     console.log("Hello")
            // }
            if(popObject[obj[YEAR]]){
                popObject[obj[YEAR]] += +obj[POPULATION]
            }else{
                popObject[obj[YEAR]] = +obj[POPULATION]
            }
        }
    }
    // store["totalPopulationExtent"] = totalPopulationExtent
    store["totalPopulationObj"] = popObject
    store["totalPopulationData"] = Object.entries(popObject)
    store["totalPopulationExtent"] = d3.extent(Object.values(popObject))
    store["years"] = Array.from(years).sort()
    store["years"].forEach(el => {
        let option = document.createElement("option")
        option.value = el
        option.text = el
        ddElement.add(option)
    })
    store["data"] = responseObj
    
    
    // console.log(responseObj)
})


function filterData(year="1950"){
    console.log("Filtered")
    let regions = new Set()
    let populationGrowthExtent = [0,0]
    let populationDensityExtent = [0,0]
    let populationExtent = [0,0]
    let firstFlagCheck = true
    store["filteredData"] = store.data.filter((el,i) => {
        if(el[YEAR] === year){
            if((+el[POPULATION_DENSITY] > 800) || +el[POPULATION_GROWTH] < -100 || +el[POPULATION_GROWTH] > 100){
                return
            }
            regions.add(el[REGION])
            if(firstFlagCheck){
                populationGrowthExtent[0] = el[POPULATION_GROWTH]
                populationDensityExtent[0] = el[POPULATION_DENSITY]
                populationExtent[0] = el[POPULATION]
                firstFlagCheck = false
            }else{
                calculateExtent(el, populationGrowthExtent, POPULATION_GROWTH)
                calculateExtent(el, populationDensityExtent, POPULATION_DENSITY)
                calculateExtent(el, populationExtent, POPULATION)
            }
            return el
        }
    })
    function calculateExtent(el, arr, key){
        if(+el[key] < arr[0]){
            arr[0] = +el[key] 
        }
        if(+el[key] > arr[1]){
            arr[1] = +el[key] 
        } 
    }
    store["populationGrowthExtent"] = populationGrowthExtent
    store["populationDensityExtent"] = populationDensityExtent
    store["populationExtent"] = populationExtent
    store["regions"] = Array.from(regions)
    console.log("Res",populationDensityExtent,populationExtent,populationGrowthExtent)
    console.log("Filter",store["filteredData"])
}

function showPopulationForTheYear(year){
    let value = store["totalPopulationObj"][year]
    document.querySelector(".text-year").textContent = "(" + year +")"
    document.querySelector(".info-count").textContent = convertToFormat(+value)
}

const convertToFormat = d3.format(".2s")


export {store as COMMON_STORE,  filterData, showPopulationForTheYear, convertToFormat}
