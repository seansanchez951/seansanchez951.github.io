
function main() {

    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 150, bottom: 60, left: 30},
        width = 800 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    var svg = d3.select("#bubble-multi-line")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    
    svg.append("text")
        .attr("transform", "translate(100, 0)")  // Position the title on the SVG element
        .attr("x", 95)
        .attr("y", -25)
        .attr("font-size", "16px")
        .text("Albums Review Scores 1999-2021")


    // append interaction instructions text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 767)
        .attr("y", 138)
        .attr("font-size", "9px")
        .text("Click legend dots to show/remove")
    // append path interaction instructions text
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 754)
        .attr("y", 150)
        .attr("font-size", "9px")
        .text("Hover text to show/hide trends")



    Promise.all([
        d3.csv("./data_files/genre-score-over-time.csv"),
        d3.csv("./data_files/genre-avg-score-month-date.csv")
    ]).then(([bubbleData, lineData]) => {

        // display data to console
        // console.log(bubbleData);
        // console.log(lineData);


        // Add X axis
        var x = d3.scaleTime()
            .domain(d3.extent(bubbleData, function (d) {
                return d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pub_date);
            }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 50)
            .text("Publication Date");


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(bubbleData, function (d) {
                return +d.score
            })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -20)
            .text("Review Score")
            .attr("text-anchor", "start")

        // Add a scale for bubble color
        var myColor = d3.scaleOrdinal()
            .domain(["Experimental", "Rock", "Electronic", "Folk_and_Country", "Rap", "Metal", "Pop_and_RnB", "Jazz", "Global"])
            .range(['#854770', '#1f78b4', '#799496', '#33a02c', '#fb9a99', '#e31a1c', '#C89933', '#14362C', '#cab2d6']);


        // build tooltip div for dots
        // -1- Create a tooltip div that is hidden by default:
        const tooltip = d3.select("#bubble-multi-line")
            .append("bubble_tooltip")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border-width", "1px")
                .style("border-radius", "1px")
                .style("padding", "10px")


        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        // mouseover
        const showTooltip = function (event, d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html(d.name + ' -- ' + d.title + ' -- ' + d.score)
                .style("left", (event.x)/2 + "px")
                .style("top", (event.y)/2-50 + "px")
        }

        // mousemove
        const moveTooltip = function (event, d) {
            tooltip
                .style("left", (event.x)/2 + "px")
                .style("top", (event.y)/2-50 + "px")
        }
        // mouseLeave
        const hideTooltip = function(event, d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }


        // create function that will show and hide path of multi-line
        const showPath = function(event, d) {
            // get path of music genre
            let path = d3.selectAll("#"+d)
            // show line path of music genre
            d3.selectAll(path).attr("visibility", "visible")

            // reduce all bubbles opacity
            // reduce opacity of all groups
            d3.selectAll(".bubbles").style("opacity", .00)
            // expect the one that is hovered
            d3.selectAll("."+d).style("opacity", .07)

        }

        const hidePath = function (event, d) {
            let path = d3.selectAll("#"+d)
            d3.selectAll(path).attr("visibility", "hidden")
            d3.selectAll(".bubbles").style("opacity", 1)
        }


        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(bubbleData)
            .join("circle")
                .attr("class", function (d) {
                    return "bubbles " + d.genre
                })
                .attr("cx", function (d) {
                    return x(d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pub_date));
                })
                .attr("cy", function (d) {
                    return y(d.score);
                })
                .attr("r", 3)
                .style("fill", function (d) {
                    return myColor(d.genre);
                })
                .style("stroke-width", 0.5 + "px")
                .style("stroke", "black")
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )
            



                // ---------------------------//
                //       LEGEND              //
                // ---------------------------//

                // Add legend: circles
                var valuesToShow = [10000000, 100000000, 1000000000]
                var xCircle = 380
                var xLabel = 440


                // Add one dot in the legend for each name.
                var size = 15
                var allgroups = ["Experimental", "Rock", "Electronic", "Folk_and_Country", "Rap", "Metal", "Pop_and_RnB", "Jazz", "Global"]
                svg.selectAll("myLegend")
                    .data(allgroups)
                    .enter()
                    .append("circle")
                    .attr("cx", 638)
                    .attr("cy", function (d, i) {
                        return 167 + i * (size + 5)
                    }) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("r", 5)
                    .style("fill", function (d) {
                        return myColor(d)
                    })
                    .style("stroke-width", 0.5 + "px")
                    .style("stroke", "black")
                    .on("click", function (event, d) {
                        let currentOpacity = d3.selectAll("."+d).style("opacity")
                        // conditional statement to change opacity
                        d3.selectAll("."+d).style("opacity", currentOpacity == 1 ? 0:1)
                    })


                // Add labels beside legend dots
                svg.selectAll("mylabels")
                    .data(allgroups)
                    .enter()
                    .append("text")
                    .attr("x", 635 + size * .8)
                    .attr("y", function (d, i) {
                        return 160 + i * (size + 5) + (size / 2)
                    }) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", function (d) {
                        return myColor(d)
                    })
                    .text(function (d) {
                        return d
                    })
                    .attr("text-anchor", "left")
                    .attr("font-size", "12px")
                    .style("alignment-baseline", "middle")
                    .on("mouseover", showPath)
                    .on("mouseleave", hidePath);


        // BELOW IS TO CONSTRUCT MULTI-LINES

        // add multi-lines but make invisible until tooltip interaction
        // need 2nd timeParse variable for only multi-line chart
        const parse_year_month = d3.timeParse("%Y-%m");

        // set ranged for multi-line
        // Set the ranges
        const x_line = d3.scaleTime().range([0, width]);
        const y_line = d3.scaleLinear().range([height, 0]);

        // Define the line
        const scoreline = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(+d.score);
            });


        // parse and format lineData
        lineData.forEach(function (d) {
            d.date = parse_year_month(d.month_year);
            d.score = +d.score;
        })

        // Scale the range of the data
        x_line.domain(d3.extent(lineData, function (d) {
            return d.date;
        }));
        y_line.domain([0, d3.max(lineData, function (d) {
            return d.score;
        })]);

        // Group the entries by symbol
        let dataNest = Array.from(
            d3.group(lineData, d => d.genre), ([key, value]) => ({key, value})
        );

        dataNest.forEach(function (d, i) {
            // apply lines
            svg.append("path")
                .attr("class", "line")
                .attr("visibility", "hidden")
                .style("stroke", function () { // Add the colours dynamically
                    return d.color = myColor(d.key);
                })
                .attr("id", d.key.replace(/\s+/g, ''))   // assign ID
                .attr("d", scoreline(d.value));

        });

    })

}


main()
