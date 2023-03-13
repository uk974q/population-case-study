import {COMMON_STORE} from "../common.js"


function LineAreaChart(){
    document.getElementById("areaChart").innerHTML = "";
    let config ={
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    }
    // debugger
    const svgContainer = document.querySelector('.area');
    const containerRect = svgContainer.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    // let width = 550
    // let height = 550
    
    let x_domain = d3.extent(COMMON_STORE["years"])
    let y_domain = COMMON_STORE["totalPopulationExtent"]

    let svg = d3.select('.area')
    .append("svg")
    .attr("width",width)
    .attr("height",height+config.marginTop+config.marginBottom)
    .append("g")
    .attr("transform",`translate(${config.marginLeft},0)`)

    var x = d3.scaleLinear()
    .domain(x_domain)
    .range([0,width-config.marginLeft - config.marginRight])
    // .nice()

    var y = d3.scaleLinear()
    .domain(y_domain)
    .range([height,0])
    .nice()

    var xAxis = d3.axisBottom(x)
        // .scale(x)
        .ticks(2)
        .tickValues([x.domain()[0], x.domain()[1]])
        // .tickPadding(8)
        .tickFormat((d,i) => Number(d))

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(8)
        .tickPadding(8)

    const line = d3.line()
    .curve(d3.curveBasis)
    .x(d => x(+d[0]))
    .y(d => {
        return y(d[1])
    })

    const area = d3.area()
    .curve(d3.curveBasis)
    .x(d => x(+d[0]))
    .y0(height)
    .y1(d => y(+d[1]))
    
    svg.append("path")
        .data([COMMON_STORE["totalPopulationData"]])
        .attr("line", d => `${+d[0]},${d[1]}`)
        // .attr("class", "line")
        .attr("fill", "url(#grad1)")
        .attr("d", line);

    svg.append("path")
        .data([COMMON_STORE["totalPopulationData"]])
        .attr("area", d => `${+d[0]},${+d[1]}`)
        .attr("class", "area")
        .attr("fill", "url(#grad1)")
        .attr("d", area);

    svg.append("g")
        .attr("class","x-axis-tick")
        .attr("transform",`translate(0,${height})`)
        .call(xAxis)

    svg.append("text")
        .attr("x", x(x.domain()[0]))
        .attr("y", y(y.domain()[0])-config.marginTop - config.marginBottom)
        .text(d3.format(".2s")(COMMON_STORE["totalPopulationObj"][x.domain()[0]]));

    svg.append("text")
        .attr("x", x(x.domain()[1])-config.marginLeft-config.marginRight)
        .attr("y", y(y.domain()[1])+config.marginTop+config.marginBottom)
        .text(d3.format(".2s")(COMMON_STORE["totalPopulationObj"][x.domain()[1]]));

    // svg.append("g")
    //     .attr("class","y-axis-tick")
    //     .call(yAxis)
    let defs = svg.append("defs")
    let gradient = defs.append("linearGradient")
        .attr("id","grad1")
        .attr("transform","rotate(0)")
        .attr("opacity",1)
        .attr("x1","0%")
        .attr("y1","0%")
        .attr("x2","0%")
        .attr("y2","100%")
        gradient.append("stop")
        .attr("offset","0%")
        .attr("stop-color","#ffefa8")
        gradient.append("stop")
        .attr("offset","100%")
        .attr("stop-color","#ffd55b")

}

export default LineAreaChart