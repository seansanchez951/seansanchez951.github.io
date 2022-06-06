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
        const Tooltip = d3.select("#treemap")
            .append("treemap_tooltip")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("font-size", "10.5px")
                .style("height", "-webkit-fill-available")
                .style("padding", "10px");


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

            // object of top 5 albums for the genre mouse is hovering over
            const genreValues = tooltipList[index].value;

            // const myJSON = JSON.stringify(tooltipList[index].value);

            // tooltip will list top 5 albums for each genre
            // genreValues object will have five keys genre,name,title,year,score
            // need to extract the values from the keys for the top 5 albums

            // this is for the 1st entry for the top 5 list
            const genreValues1 = genreValues[0];
            const artistName1 = genreValues1.name;
            const albumName1 = genreValues1.title;
            const yearName1 = genreValues1.year;
            const scoreName1 = genreValues1.score;
            const genreName1 = genreValues1.genre;

            // this is the 2nd entry for the top 5 list
            const genreValues2 = genreValues[1];
            const artistName2 = genreValues2.name;
            const albumName2 = genreValues2.title;
            const yearName2 = genreValues2.year;
            const scoreName2 = genreValues2.score;
            const genreName2 = genreValues2.genre;

            // this is the 3rd entry for the top 5 list
            const genreValues3 = genreValues[2];
            const artistName3 = genreValues3.name;
            const albumName3 = genreValues3.title;
            const yearName3 = genreValues3.year;
            const scoreName3 = genreValues3.score;
            const genreName3 = genreValues3.genre;

            // this is the 4th entry for the top 5 list
            const genreValues4 = genreValues[3];
            const artistName4 = genreValues4.name;
            const albumName4 = genreValues4.title;
            const yearName4 = genreValues4.year;
            const scoreName4 = genreValues4.score;
            const genreName4 = genreValues4.genre;

            // this is the 5th entry for the top 5 list
            const genreValues5 = genreValues[4];
            const artistName5 = genreValues5.name;
            const albumName5 = genreValues5.title;
            const yearName5 = genreValues5.year;
            const scoreName5 = genreValues5.score;
            const genreName5 = genreValues5.genre;


            Tooltip
                .html("Top 5 Albums Per Genre" + "<br />"+"<br />"+ "#1  " + artistName1 + ' - ' + albumName1 + ' - ' + yearName1 + ' - ' + scoreName1 + "<br />"+"<br />" +
                    "#2 " + artistName2 + ' - ' + albumName2 + ' - ' + yearName2 + ' - ' + scoreName2 + "<br />"+"<br />" +
                '#3 ' + artistName3 + ' - ' + albumName3 + ' - ' + yearName3 + ' - ' + scoreName3 + "<br />"+"<br />" +
                '#4 ' + artistName4 + ' - ' + albumName4 + ' - ' + yearName4 + ' - ' + scoreName4 + "<br />"+"<br />" +
                '#5 ' + artistName5 + ' - ' + albumName5 + ' - ' + yearName5 + ' - ' + scoreName5)
                .style("left", (event.pageX) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.pageY) + "px")
        };


        const mouseleave = function (event, d) {
            d3.select(this)
                .style("fill", function(d) {return myColor(d.parent.data.name)})
            Tooltip
                .style("opacity", 0)
                .style("stroke", "black")
                .style("opacity", 0.8)
                .style("fill", "#FBFFF1");
        };


        // Add a scale for bubble color
        const myColor = d3.scaleOrdinal()
            .range(['#fcfbfd','#efedf5','#dadaeb','#bcbddc','#9e9ac8','#807dba','#6a51a3','#54278f','#3f007d']);

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
            .style("fill", function(d) {return myColor(d.parent.data.name)})
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        // .style("fill", "#FBFFF1")

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
