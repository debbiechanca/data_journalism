var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var $div = d3
.select("body")
.append("div")
  .attr("id", "chart")

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = $div
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./data/data.csv", function (err, healthData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  healthData.forEach(function (data) {
    data.disability18to64 = +data.disability18to64;
    data.poorHealth = +data.poorHealth;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.disability18to64)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.poorHealth)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //  Step 5a: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.disability18to64))
  .attr("cy", d => yLinearScale(d.poorHealth))
  .attr("r", "8")
  .attr("fill", "red")
  .attr("opacity", ".75");
  
  //    // Step 5b: Label each circle
  // // ==============================
  // var xScale = d3.scaleLinear().range([0, width]);
  // var yScale = d3.scaleLinear().range([height, 0]);

  // var circlesGroup = chartGroup.selectAll("text")
  // .data(healthData)
  // .enter()
  // .append("text")
  // .attr("x", (d) => {return xScale(d.disability18to64)})
  // .attr("y", (d) => {return yScale(d.poorHealth)})
  // .attr("fill", "black")
  // .text((d) => { return d.abbr});

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Disability: ${d.disability18to64}<br>Poor Health: ${d.poorHealth}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("click", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poor Health");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Disability Ages 18 to 64");
});
