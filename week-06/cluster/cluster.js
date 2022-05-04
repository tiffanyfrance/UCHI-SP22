d3.csv("data.csv").then(data => {
    let colors = ['#B42F90','#16B1AC','#FF0909','#6985DD','#0BE304','#9A303D','#979883','#FF09D3','#FF7C09','#EFE71F','#7FA25A','#7A57C7','#804C13','#C2C757','#1F52EF'];

    let result = d3.group(data, d => d.category);

    let i = 0;
    for(let [a, b] of result) {
        let cat = a.toLowerCase();
        let color = colors[i++];
        let items = [];

        for (let j = 0; j < b.length; j++) {
            let newObj = {}
            newObj.node = b[j].item;
            items.push(newObj);
        }

        buildChart(cat,color,items);  
    }
});

const tooltip = d3.select("body").append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

function buildChart(cat,color,nodes) {
    let svg = d3.select('.' + cat + ' svg');

    let width = svg.style('width').slice(0, -2),
        height = svg.style('height').slice(0, -2);
    
        const radius = 10;

        let simulation = d3.forceSimulation(nodes)
            .force("charge", d3.forceManyBody().strength(30)) //strength
            .force('x', d3.forceX().x(() => Math.random() * width))
            .force('y', d3.forceY().y(height / 2))
            .force("collision", d3.forceCollide().radius(radius));
      
        simulation.on("tick", () => {
      
          svg
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", radius)
            .attr("fill", color)
            .attr("opacity", 0.75)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 1);
                tooltip
                    .style("visibility", "visible")
                    .html(d.node);
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("opacity", 0.75);
                tooltip.style("visibility", "hidden");
            })
        });
}