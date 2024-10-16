// URL of the dataset (GDP data)
var datasetUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Select the SVG element and define margins and dimensions
var svg = d3.select("svg"),
  margin = { top: 50, right: 50, bottom: 100, left: 100 },
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom;

// Create group element to hold the chart
var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Fetch the dataset using d3.json()
d3.json(datasetUrl).then(function (data) {
  var gdpData = data.data;

  // Define the x and y scales based on the data
  var xScale = d3
    .scaleBand()
    .domain(gdpData.map((d) => d[0])) // Use the date as the x-axis domain
    .range([0, width])
    .padding(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(gdpData, (d) => d[1])]) // Use GDP value as the y-axis domain
    .range([height, 0]);

  // Add the x-axis
  g.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")") // Position x-axis at the bottom
    .call(
      d3.axisBottom(xScale).tickValues(
        xScale.domain().filter((d, i) => !(i % 20)) // Show fewer x-axis ticks
      )
    )
    .selectAll("text")
    .attr("transform", "rotate(45)") // Rotate x-axis text
    .style("text-anchor", "start");

  // Add the y-axis
  g.append("g").attr("id", "y-axis").call(d3.axisLeft(yScale));

  // Create a Tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip") // Set the ID to tooltip
    .style("opacity", 0)
    .style("position", "absolute") // Position it absolutely
    .style("background-color", "white")
    .style("border", "solid 1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none"); // Prevent the tooltip from capturing mouse events

  // Mouseover, mousemove, and mouseleave event handlers for tooltip
  var mouseover = function (event, d) {
    tooltip
      .html(`Date: ${d[0]}<br>GDP: $${d[1].toFixed(2)} Billion`) // Tooltip content
      .style("opacity", 1)
      .attr("data-date", d[0]); // Set the tooltip's "data-date" attribute
  };

  var mousemove = function (event) {
    tooltip
      .style("left", event.pageX + 10 + "px") // Move the tooltip to follow the mouse
      .style("top", event.pageY - 28 + "px");
  };

  var mouseleave = function () {
    tooltip.style("opacity", 0); // Hide the tooltip when the mouse leaves
  };

  // Add bars to the chart
  g.selectAll(".bar")
    .data(gdpData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0]) // Set data-date attribute to the date
    .attr("data-gdp", (d) => d[1]) // Set data-gdp attribute to the GDP value
    .attr("x", (d) => xScale(d[0])) // Position the bar using xScale
    .attr("y", (d) => yScale(d[1])) // Position the bar using yScale
    .attr("width", xScale.bandwidth()) // Set the width of each bar
    .attr("height", (d) => height - yScale(d[1])) // Set the height of each bar
    .attr("fill", "navy")
    .on("mouseover", mouseover) // Tooltip appears on mouseover
    .on("mousemove", mousemove) // Tooltip moves with the mouse
    .on("mouseleave", mouseleave); // Tooltip disappears on mouseleave
});
