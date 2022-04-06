d3.csv('long-terminterest-monthly.csv').then(data => {
  let timeParse = d3.timeParse("%Y-%m");

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
  }

  let height = 500,
    width = 800,
    margin = ({ top: 25, right: 30, bottom: 35, left: 20 });

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Value)])
    .range([height - margin.bottom, margin.top]);

  let line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.Value));

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(d => d + "%"));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("d", line)
});