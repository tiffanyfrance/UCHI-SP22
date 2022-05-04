d3.csv("data.csv").then(data => {
    let colors = ['#B42F90','#16B1AC','#FF0909','#6985DD','#0BE304','#9A303D','#979883','#FF09D3','#FF7C09','#EFE71F','#7FA25A','#7A57C7','#804C13','#C2C757','#1F52EF'];

    let result = d3.group(data, d => d.category);

    let i = 0;
    for(let [a, b] of result) {
        let cat = a.toLowerCase();
        let color = colors[i++];
        let items = [];

        for (let j = 0; j < b.length; j++) {
            items.push(b[j].item);
        }

        buildChart(cat,color,items);  
    }
});

const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

function buildChart(cat,color,items) {
    let width = +d3.select('.' + cat + ' svg').style('width').slice(0, -2),
        height = 300;

    let xScale = d3.scaleLinear().domain([0, 1]).range([0, (width-100)]);

    let numNodes = items.length;
    let nodes = d3.range(numNodes).map(function(d, i) {
      return {
        //this radius is how far apart the nodes are
        radius: 11,
        //this dictates where the value lands on x-axis
        value: Math.random(),
        item: items[i]
      }
    });

    let simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('x', d3.forceX().x(function(d) {
        return xScale(d.value);
      }))
      .force('y', d3.forceY().y(function(d) {
        return 0;
      }))
      .force('collision', d3.forceCollide().radius(function(d) {
        return d.radius;
      }))
      .on('tick', ticked);
      
    function ticked() {
      let u = d3.select('.' + cat + ' svg g')
        .selectAll('circle')
        .data(nodes);

      u.enter()
        .append('circle')
        .attr('r', '10px')
        .style('fill', function(d) {
            return color;
        })
        .style('opacity', 0.8)
        .merge(u)
        .attr('cx', function(d) {
            return d.x;
        })
        .attr('cy', function(d) {
            return d.y;
        })
        .on("mouseover", function(event, d) {
            d3.select(this)
                .style('opacity', 1);

            d3.select(this).attr("fill", "red");
            tooltip
                .style("visibility", "visible")
                .html(d.item);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .style('opacity', 0.8);

            d3.select(this).attr("fill", "black");
            tooltip.style("visibility", "hidden");
        })

      u.exit().remove();
    }
}