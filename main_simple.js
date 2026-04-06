// global variables
{
let dataset;
let simulation;

d3.json("data/graph1.json")
    .then(function(data) { // load in data
        dataset = data;
        console.log("full dataset:", dataset);
        console.log("links:", dataset.links);
        console.log("nodes:", dataset.nodes);
        const links = dataset.links.map(d => ({...d}));
        const nodes = dataset.nodes.map(d => ({...d}));

        // create simulation
        simulation = d3.forceSimulation(nodes)
                            .force("link", d3.forceLink(links).id(d => d.id).distance(35))
                            .force("charge", d3.forceManyBody())
                            .force("center", d3.forceCenter(width / 2, height / 2))
                            .force("x", d3.forceX())
                            .force("y", d3.forceY());


        // creating svg element to store viz
        const svg = d3.select("#simple-network")
            .append("svg")
            // .attr("viewBox", "0 0 100 100")
            .attr("width", '100%')
            .attr("height", height)
            .attr("class", "svg-style");

        // defining how links will look like
        const link = svg.append("g")
            .attr("stroke", "#999")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", d => d);

        // defining how nodes will look like
        const node = svg.append("g")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)
                        .selectAll("circle")
                        .data(nodes)
                        .join("circle")
                        .attr("r", 5)
                        .attr("fill", d => color(d.id))
                        .on("mouseover", function(event, d) {
                            d3.select(this)
                                .transition()
                                .duration(1)
                                .attr("r", 7)

                            // makes div appear
                            div.transition()
                                .duration(100)
                                .style("opacity", 1);

                            div.html(d.id)
                                .style("left", (event.pageX + 10) + "px")
                                .style("top", (event.pageY - 15) + "px");
                        })
                        .on('mouseout', function(event, d) {
                            d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 5)

                            // makes div disappear
                            div.transition()
                                .duration('200')
                                .style("opacity", 0);
                        });

        let div = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);


        // node.append("title")
        //     .text(d => d.id)


        // creating drag element
        node.call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

        
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

        });
    }
)
const width = 1000;
const height = 1000;

const color = d3.scaleOrdinal(d3.schemeCategory10);

// reheat the simulation when drag starts, and fix the subject position
function dragStarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}

// update the dragged node's position during drag
function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

// restore the target alpha so the simulation cools after dragging ends
// unfix the subject position now that it’s no longer being dragged
function dragEnded(event) {
    if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
}

}