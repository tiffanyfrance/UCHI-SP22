d3.csv('long-terminterest-monthly.csv').then(data => {
  let timeParse = d3.timeParse("%Y-%m");

  for (let d of data) {
    d.Date = timeParse(d.Date);
    d.Value = +d.Value;
  }

  let height = 500,
    width = 800,
    margin = ({ top: 25, right: 30, bottom: 35, left: 25 });

  let x = d3.scaleTime()
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Value)])
    .range([height - margin.bottom, margin.top]);

  let area = d3.area()
    .x(d => x(d.Date))
    .y0(y(0))
    .y1(d => y(d.Value));

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(d => d + "%").tickSizeOuter(0));

  svg.append("path")
    .datum(data)
    .attr("fill", "steelblue")
    .attr("stroke", "steelblue")
    .attr("d", area);
});