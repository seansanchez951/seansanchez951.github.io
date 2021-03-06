
function main() {

    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    const svg = d3.select("#whitehat")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // append text element to svg
    svg.append("text")
        .attr("transform", "translate(100, 0")
        .attr("x", 150)
        .attr("y", 10)
        .attr("stroke", "black")
        .attr("font-size", "18px")
        .text("Netflix Stock Closing Prices")

    //Read the data
    d3.csv("./data/netflix.csv",

        // format variables:
        function(d){
            return { date : d3.timeParse("%Y-%m-%d")(d.date), close_price : +d.close_price }
        }).then(

        // use this dataset:
        function(data) {

            // console.log(data);

            // Add X axis --> it is a date format
            const x = d3.scaleTime()
                .domain(d3.extent(data, function(d) { return d.date; }))
                .range([ 0, width ]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .append("text")
                .attr("y", height - 331)
                .attr("x", width /2 - 15)
                .attr("stroke", "black")
                .attr("font-size", "14px")
                .text("Year");

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.close_price; })])
                .range([ height, 0 ]);
            svg.append("g")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 26)
                .attr("x", -100)
                .attr("dy", "-5.1em")
                .attr("stroke", "black")
                .attr("font-size", "14px")
                .text("Closing Price in dollars($)");

            // Add the line
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.date) })
                    .y(function(d) { return y(d.close_price) })
                )



        })

}

main()
