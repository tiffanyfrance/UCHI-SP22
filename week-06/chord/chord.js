d3.csv("degrees.csv", (d) => {
  d.value = +d.value;
  return d;
}).then((data) => {
  const names = ["Males", "Females", "Associate", "Bachelors", "Masters", "Doctors"];

  const index = new Map(names.map((name, i) => [name, i]));
  const matrix = Array.from(index, () => new Array(names.length).fill(0));
  
  for (const { source, target, value } of data) {
    matrix[index.get(source)][index.get(target)] = value;
  }

  console.log(matrix);

  const height = 800,
    width = 800,
    innerRadius = Math.min(width, height) * 0.5 - 100,
    outerRadius = innerRadius + 6;

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

    // const ribbon = d3.ribbonArrow()
  const ribbon = d3.ribbon()
    .radius(innerRadius - 0.5)
    .padAngle(1 / innerRadius);

  const chords = d3.chordDirected()
    .padAngle(12 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending)(matrix);

  console.log(chords) //radian system

  const color = d3.scaleOrdinal(names, ['green', 'purple', '#ccc', '#ccc', '#ccc', '#ccc']);

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("transform", "rotate(-90)")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("path")
    .attr("id", "text-id")
    .attr("fill", "none")
    .attr("d", d3.arc()({ outerRadius, startAngle: 0, endAngle: 2 * Math.PI }));

  svg.append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("g")
    .data(chords)
    .join("path")
    .attr("d", ribbon)
    .attr("fill", d => color(names[d.source.index]))
    .style("mix-blend-mode", "multiply")
    .append("title")
    .text(d => `${names[d.source.index]} earned ${d.source.value.toLocaleString()} ${names[d.target.index]} Degrees`);

  svg.append("g")
    .selectAll("g")
    .data(chords.groups)
    .join("g")
    .call(g => g.append("path")
      .attr("d", arc)
      .attr("fill", d => color(names[d.index]))
      .attr("stroke", "#fff"))
    .call(g => g.append("text")
      .attr("dy", -3)
      .append("textPath")
      .attr("href", "#text-id")
      .attr("startOffset", d => d.startAngle * outerRadius)
      .text(d => names[d.index]))
      .attr("fill", d => color(names[d.index]) != "#ccc" ? color(names[d.index]) : "#666");
});