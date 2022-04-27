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
    .attr("y", d => y(d.cases))
    .attr("height", d => y(0) - y(d.cases));

  bar.append('text')
    .text(d => d.cases)
    .attr('x', d => x(d.country) + (x.bandwidth() / 2))
    .attr('y', d => y(d.cases) - 5)
    .attr('text-anchor', 'middle');

  // Annotation
  let total = d3.sum(data, d => d.cases).toLocaleString();
  let str = `There are <span style="color:red;">${total}</span> 
    COVID cases total in the data.`

  svg.append("foreignObject")
    .attr("x", 420)
    .attr("y", 40)
    .attr("width", 120)
    .attr("height", 100)
    .append('xhtml:div')
    .append("p")
    .html(str);
});