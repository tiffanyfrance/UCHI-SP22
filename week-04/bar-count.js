d3.json('covid.json').then(data => {
  let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 35, left: 40 });

  let x = d3.scaleBand()
    .domain(data.map(d => d.country))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.cases)]).nice()
    .range([height - margin.bottom, margin.top]);

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

  let yAxis = g => g
    .attr("transform", `translate(${margin.left - 5},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select(".domain").remove());

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  const bar = svg.selectAll(".bar")
    .append("g")
    .data(data)
    .join("g")
    .attr("class", "bar");

  bar.append("rect")
    .attr("fill", "#4682B4")
    .attr("x", d => x(d.country))
    .attr("width", x.bandwidth())
    .attr("y", height - margin.bottom)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .delay((d, i) => i * 100)
    .attr("y", d => y(d.cases))
    .attr("height", d => y(0) - y(d.cases));

  bar.append('text')
    .text(d => 0)
    .attr('x', d => x(d.country) + (x.bandwidth() / 2))
    .attr("y", height - margin.bottom - 5)
    .attr('text-anchor', 'middle')
    .transition()
    .duration(2000)
    .delay((d, i) => i * 100)
    .tween("text", function(d) {
      let i = d3.interpolate(this.textContent, d.cases)

      return function(t) {
        this.textContent = Math.round(i(t));
      };
    })
    .attr('y', d => y(d.cases) - 5);

});