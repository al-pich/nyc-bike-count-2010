// https://observablehq.com/d/02628e98d833e71d@201
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["BicycleCounts1980-Today - Marimekko_Chart_BikeCounts_2010_2019@2.csv",new URL("./files/e0ffa0330c452d8da31c2b4c0903346b6d0fcdc23cb612d8c77ee6acc39ef32f3b1eab7600efd876b8ca2504deca0d7e5e5800a2e2195340067d1ad043e6c03e",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Bicycle Counts in Manhattan by Location, 2010-2019

This Marimekko chart shows the proportion of bicycle traffic at NYC DOT's three count locations in Manhattan; East River Bridges (Brooklyn, Manhattan - starting in 2011, Williamsburg and Queensboro), Midtown screenline locations, and 85th Street as the screenline Uptown. Only the bridges have automated traffic counters but as this chart shows Midtown and Uptown serve a larger proportion of bicycle traffic.

Check out the story behind this data and see more visualizations of bicycling trends in NYC by [Alyssa Pichardo](https://medium.com/@alyssa.pichardo)

Data for 2019 in Uptown and Midtown is estimates as is Uptown from 2008-2010 and 2012-2014. Original data sourced from [NYC DOT](https://www1.nyc.gov/html/dot/html/bicyclists/bike-counts.shtml).`
)});
  main.variable(observer("chart")).define("chart", ["treemap","data","d3","width","height","format","color"], function(treemap,data,d3,width,height,format,color)
{
  const root = treemap(data);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  const node = svg.selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  const column = node.filter(d => d.depth === 1);

  column.append("text")
      .attr("x", 3)
      .attr("y", "-1.7em")
      .style("font-weight", "bold")
      .text(d => d.data.key);

  column.append("text")
      .attr("x", 3)
      .attr("y", "-0.5em")
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value));

  column.append("line")
      .attr("x1", -0.5)
      .attr("x2", -0.5)
      .attr("y1", -30)
      .attr("y2", d => d.y1 - d.y0)
      .attr("stroke", "#000")

  const cell = node.filter(d => d.depth === 2);

  cell.append("rect")
      .attr("fill", d => color(d.data.key))
      .attr("fill-opacity", (d, i) => d.value / d.parent.value)
      .attr("width", d => d.x1 - d.x0 - 1)
      .attr("height", d => d.y1 - d.y0 - 1);

  cell.append("text")
      .attr("x", 3)
      .attr("y", "1.1em")
      .text(d => d.data.key);

  cell.append("text")
      .attr("x", 3)
      .attr("y", "2.3em")
      .attr("fill-opacity", 0.7)
      .text(d => format(d.value));

  return svg.node();
}
);
  main.variable(observer("treemap")).define("treemap", ["d3","width","margin","height"], function(d3,width,margin,height){return(
data => d3.treemap()
    .round(true)
    .tile(d3.treemapSliceDice)
    .size([
      width - margin.left - margin.right, 
      height - margin.top - margin.bottom
    ])
  (d3.hierarchy(
    {
      values: d3.nest()
          .key(d => d.x)
          .key(d => d.y)
        .entries(data)
    },
    d => d.values
  ).sum(d => d.value))
  .each(d => {
    d.x0 += margin.left;
    d.x1 += margin.left;
    d.y0 += margin.top;
    d.y1 += margin.top;
  })
)});
  main.variable(observer("format")).define("format", function(){return(
d => d.toLocaleString()
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(d3.schemeSet2).domain(data.map(d => d.y))
)});
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("BicycleCounts1980-Today - Marimekko_Chart_BikeCounts_2010_2019@2.csv").text(), ({year, zone, value}) => ({x: year, y: zone, value}))
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 30, right: -1, bottom: -1, left: 1}
)});
  main.variable(observer("height")).define("height", ["width"], function(width){return(
width
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
