function main() {


    // set dimensions and margins of the graph
    var margin = {top: 20, right: 10, bottom: 10, left: 10},
        width = 645 - margin.left - margin.right,
        height = 645 - margin.top - margin.bottom;


    // append the svg object to the body of the page
    var svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    Promise.all([
        d3.csv("./data_files/genre-average-score.csv"),
        d3.csv("./data_files/top-five-albums.csv")
    ]).then(([treeData,toolData]) => {

        // console.log(treeData);
        // console.log(toolData);
        makeTreemap(treeData,toolData);

    });


    function makeTreemap(treeData,toolData) {


        // stratify the data: reformatting for d3.js
        var root = d3.stratify()
            .id(function(d) { return d.genre; })  // name of the entity
            .parentId(function(d) { return d.parent; }) // name of the parent (column name is parent in csv)
            (treeData);
        root.sum(function(d) { return +d.score })   // compute the numeric value for each entity


        // d3.treemap computes the position of each element of the hierarchy
        // the coordinates are added to the root object above
        d3.treemap()
            .size([width, height])
            .padding(4)
            (root)


        let leafs = root.leaves()


        // Group the entries by genre
        let tooltipList = Array.from(
            d3.group(toolData, d => d.genre), ([key, value]) => ({key, value})
        );


        // tooltipList[4].value gets the values from index 4, index 4 is key index for Jazz
        // console.log(tooltipList[4].value);
        // gets the string version of the key
        // console.log(tooltipList[4].key);
        // console.log(tooltipList[index].value[0]);
        // tooltipList is an object
        // var index = tooltipList.map(function(o) { return o.key; }).indexOf("Jazz");



        // create a tooltip
//         const Tooltip = d3.select("treemap")
//             .append("div")
//             .style("opacity", 0)
//             .attr("class", "tooltip")
//             .style("background-color", "white")
//             .style("border", "solid")
//             .style("border-width", "1px")
//             .style("border-radius", "5px")
//             .style("padding", "10px");


        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
            d3.select(this)
                .style("fill", "#DE9E36")
            Tooltip
                .style("opacity", 1)
                .style("stroke", "black")
        };

        // need to change the mouse interaction code to events
        const mousemove = function (event, d) {

            // d.data.genre gets the string version of the nodes genre
            // console.log(d.data.genre)
            // console.log(tooltipList)
            const index = tooltipList.map(function (o) {
                return o.key;
            }).indexOf(d.data.genre);

            const myJSON = JSON.stringify(tooltipList[index].value);

            Tooltip
                .html(myJSON)
                .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.pageY) + "px")
        };


        const mouseleave = function (event, d) {
            d3.select(this)
                .style("fill", "#FBFFF1");
            Tooltip
                .style("opacity", 0)
                .style("stroke", "black")
                .style("opacity", 0.8)
                .style("fill", "#FBFFF1");
        };

        // use the above information to add rectangles:
        svg
            .selectAll("rect")
            .data(leafs)
            .enter()
            .append("rect")
            .attr('x', function(d) {return d.x0; })
            .attr('y', function(d) {return d.y0; })
            .attr('width', function(d) {return d.x1 - d.x0; })
            .attr('height', function(d) {return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", "#FBFFF1")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)



        // create variable for rounding review score 2 decimal places
        const f = d3.format(".2f");

        // add text labels
        svg
            .selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr('x', function(d) { return d.x0+10 }) // +10 to adjust position (more right)
            .attr('y', function(d) { return d.y0+20 }) // +20 to adjust position (lower)
            .text(function(d){ return d.data.genre + "\r\n " + f(+d.data.score)
            })
            .attr("font-size", "16px")
            .attr("fill", "black")

    }


}


main()
