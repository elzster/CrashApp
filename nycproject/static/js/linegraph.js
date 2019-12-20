var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var nycOpenData = "https://data.cityofnewyork.us/resource/h9gi-nx95.geojson";
// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(nycOpenData).then( data => {
    // console.log(data); works
    //function to define date-time
    // var parseTime = d3.timeParse("%d-%b-%Y");
//format data
    data.forEach( function(data){
        data.date = parseTime(data.date);
        data.dow_index = +data.dow_index;
        data.smurf_sightings = +data.smurf_sightings;
    });
//Step 5
    var xTimeScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

    var yLinearScale1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.dow_index)])
    .range([height, 0]);

    var yLinearScale2 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.smurf_sightings)])
    .range([height, 0]);

//Step 6
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%d-%b-%Y"));
    var leftAxis = d3.axisLeft(yLinearScale1);
    var rightAxis = d3.axisRight(yLinearScale2);
//Step 7
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
    .attr("stroke", "green") // NEW!
    .call(leftAxis);

    // CHANGE THE TEXT TO THE CORRECT COLOR
    chartGroup.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .attr("stroke", "blue") // NEW!
    .call(rightAxis);

//Step 8
    var line1 = d3
    .line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale1(d.dow_index));

    var line2 = d3
    .line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale2(d.smurf_sightings));

  // Append a path for line1
    chartGroup.append("path")
        .data([data])
        .attr("d", line1)
        .classed("line green", true);

    // Append a path for line2
    chartGroup.append("path")
        .data([data])
        .attr("d", line2)
        .classed("line blue", true);
//Add Text from Step 9 in previous Example.

})