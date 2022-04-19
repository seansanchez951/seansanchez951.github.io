function main() {

// set the dimensions and margins of the graph
    var margin = {top: 40, right: 30, bottom: 40, left: 100},
        width = 650 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // Select the SVG canvas, specify the margin, and initialize the width & height variables
    var svg = d3.select("#lollipop-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    svg.append("text")
        .attr("transform", "translate(100, 0)")  // Position the title on the SVG element
        .attr("x", 130)
        .attr("y", 30)
        .attr("font-size", "23px")
        .text("Average Review Score Per Year")


    // This group is what the x-axis, y-axis, and the elements are attached to. It contains the other 3 groups.
    var container_g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + ", " + margin.top + ")");

  
    // Parse the Data
    d3.csv("./data_files/pfk-avg-score-per-year.csv").then(data => {

        // console.log(data)

        // sort data
        data.sort(function(b, a) {
            return a.score - b.score;
        });

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 10])
            .range([0, width]);
        container_g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("x", 280)
            .attr("y", 35)
            .attr("stroke", "black")
            .attr("font-size", "16px")
            .text("Review Score"); // Specify the Label for the x-axis


        // Add Y axis
        var y = d3.scaleBand()
            .domain(data.map(function (d) {
                return d.year;
            }))
            .range([0, height])
            .padding(1);
        container_g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 25) // Specify the y-position of the axis
            .attr("x", -150) // Specify the x-position of the axis
            .attr("dy", "-5.1em")
            .attr("stroke", "black")
            .attr("font-size", "16px")
            .text("Year");


        // apply loading interaction start lines and circles at 0

        // Lines
        container_g.selectAll("myline")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return x(0);
            })
            .attr("x2", x(0))
            .attr("y1", function (d) {
                return y(d.year);
            })
            .attr("y2", function (d) {
                return y(d.year);
            })
            .attr("stroke", "grey")


        // Circles
        container_g.selectAll("mycircle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(0);
            })
            .attr("cy", function (d) {
                return y(d.year);
            })
            .attr("r", "6")
            .style("fill", "#69b3a2")
            .attr("stroke", "black")


        // change the X coordinates of line and circles
        container_g.selectAll("circle")
            .transition()
            .duration(2000)
            .attr("cx", function(d) { return x(d.score); })

        container_g.selectAll("line")
            .transition()
            .duration(2000)
            .attr("x1", function(d) { return x(d.score); })



        // to format values
        let format = d3.format(".2f");

        // add review score text at the end of values
        container_g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("text-anchor", d => d.value < 0 ? "end" : "start")
            .attr("x", d => x(d.score) + Math.sign(d.score - 0) * 8)
            .attr("y", function(d) {return y(d.year); })
            .attr("dy", "0.35em")
            .text(d => format(d.score));



    })

}


main()
