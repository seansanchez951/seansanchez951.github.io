// <script src="blackhat.js"></script>

function main() {
// set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    const svg = d3.select("#blackhat")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    svg.append("text")
        .attr("transform", "translate(100, 0)")  // Position the title on the SVG element
        .attr("x", 55)
        .attr("y", 20)
        .attr("font-size", "23px")
        .text("When Netflix Almost Made It...")

    d3.csv("./data/netflix.csv", function (d) {
        return {
            date: d['date'],
            close_price: d['close_price'],
        };
    }).then(function (d) {

        let data = []

        // data processing to make find average closing price for each year
        let prev_year = d3.timeParse("%Y-%m-%d")(d[0].date).getFullYear()
        let curr_year = prev_year
        let year_temp = []
        for (let i = 0; i < d.length; i = i + 1) {
            curr_year = d3.timeParse("%Y-%m-%d")(d[i].date).getFullYear()

            if (curr_year !== prev_year) {
                data.push({
                    'date': prev_year,
                    'close_price': d3.mean(year_temp)
                })
                year_temp = []
            }

            prev_year = curr_year
            year_temp.push(d[i].close_price)
        }

        console.log(data.slice(0,11))

        // omitting data showing rise in closing price
        data = data.slice(0,11);


        var x = d3.scaleBand()
            .domain(data.map(function (d) { return d.date; }))
            .rangeRound([0, width])
            .padding(0.2);

        var y = d3.scaleLinear()
            .domain([-50, 100])
            .range([height, 0]);

        let y_axis = d3.axisLeft().scale(y);
        let x_axis = d3.axisBottom().scale(x);

        svg.append('g')
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", function (d) {
                return x(d.date);
            })
            .attr("y", function (d) {
                return y(d.close_price);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d.close_price); })
            .attr("fill", function(d) {
                if (d.date === 2006) {
                    // color red
                    return "#B10F2E"
                } else {
                    return "#ADD9F4"
                }
            })


        svg.append('g')
            .call(y_axis);
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(x_axis);





    })


}

main()
