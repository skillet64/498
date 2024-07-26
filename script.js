// Dimensions of the SVG container
const width = 975;
const height = 610;

// Create SVG element
const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

// Define the map projection and path generator
const projection = d3.geoMercator().scale(150).translate([width / 2, height / 1.5]);
const path = d3.geoPath().projection(projection);

// Create zoom behavior
const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

svg.call(zoom);

// Append the map to the SVG
const g = svg.append("g");

// Load and display the world map
d3.json("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/countries.geojson").then(world => {
    g.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("fill", "#d0d0d0")
        .attr("stroke", "#fff")
        .attr("d", path);
});

// Load and display meteorite data
d3.csv("Meteorite_Landings.csv").then(data => {
    // Convert lat/lng to numbers
    data.forEach(d => {
        d.reclat = +d.reclat;
        d.reclong = +d.reclong;
    });

    // Append meteorite landings as circles
    g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => projection([d.reclong, d.reclat])[0])
        .attr("cy", d => projection([d.reclong, d.reclat])[1])
        .attr("r", 2)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .append("title")
        .text(d => `${d.name}\nMass: ${d['mass (g)']}`);  // Customize tooltip as needed
});

// Function to handle zoom events
function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
}
