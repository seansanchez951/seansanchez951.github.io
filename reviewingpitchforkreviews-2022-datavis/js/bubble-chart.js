

function main() {

    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 150, bottom: 60, left: 30},
        width = 800 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");



    //Read the data
    d3.csv("./data_files/genre-score-over-time.csv", function(data) {

        // ---------------------------//
        //       AXIS  AND SCALE      //
        // ---------------------------//

        // Add X axis
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pub_date); }))
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add X axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height+50 )
            .text("Publication Date");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){
                return +d.score
            })])
            .range([ height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add Y axis label:
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -20 )
            .text("Review Score")
            .attr("text-anchor", "start")


        // Add a scale for bubble color
        var myColor = d3.scaleOrdinal()
            .domain(["Experimental", "Rock", "Electronic", "Folk_and_Country", "Rap", "Metal", "Pop_and_RnB", "Jazz", "Global"])
            .range(d3.schemeSet1);



        // ---------------------------//
        //      TOOLTIP               //
        // ---------------------------//

        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("#bubble-chart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
        var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Country: " + d.country)
                .style("left", (d3.mouse(this)[0]+30) + "px")
                .style("top", (d3.mouse(this)[1]+30) + "px")
        }
        var moveTooltip = function(d) {
            tooltip
                .style("left", (d3.mouse(this)[0]+30) + "px")
                .style("top", (d3.mouse(this)[1]+30) + "px")
        }
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }


        // ---------------------------//
        //       HIGHLIGHT GROUP      //
        // ---------------------------//

        // What to do when one group is hovered
        var highlight = function(d){
            // reduce opacity of all groups
            d3.selectAll(".bubbles").style("opacity", .00)
            // except the one that is hovered
            d3.selectAll("."+d).style("opacity", 1)
        }

        // And when it is not hovered anymore
        var noHighlight = function(d){
            d3.selectAll(".bubbles").style("opacity", 1)
        }


        // ---------------------------//
        //       CIRCLES              //
        // ---------------------------//

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function(d) { return "bubbles " + d.genre })
            .attr("cx", function(d) {
                return x(d3.timeParse("%Y-%m-%d %H:%M:%S")(d.pub_date));
            })
            .attr("cy", function(d){
                return y(d.score);
            })
            .attr("r", 3)
            .style("fill", function (d) { return myColor(d.genre); } )
            // -3- Trigger the functions for hover
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
        svg.selectAll("myrect")
            .data(allgroups)
            .enter()
            .append("circle")
            .attr("cx", 638)
            .attr("cy", function(d,i){ return 167 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 5)
            .style("fill", function(d){ return myColor(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)

        // Add labels beside legend dots
        svg.selectAll("mylabels")
            .data(allgroups)
            .enter()
            .append("text")
            .attr("x", 635 + size*.8)
            .attr("y", function(d,i){ return 160 + i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return myColor(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    })


}



main()
