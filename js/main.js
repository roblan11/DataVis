visuWidth = window.innerWidth || document.body.clientWidth;
visuHeight = 600;

fixedEdgeLength = 100;

d3.csv("https://raw.githubusercontent.com/roblan11/DataVis/master/data/pokemon.csv", function(pokemon) {



    // data processing 
/*
    console.log(data)

    let nodes = []
    let edges = []

    foreach(p) {
        node
        nodes.push(node)
    }

    let data = {"nodes": nodes, "edges":edges}
*/


    // data to test
    data = {"nodes": [{"id":"8", "fx": visuWidth/2, "fy": visuHeight/2},{"id":"9"},{"id":"19"}],"edges": [{"source":0,"target":1},{"source":0,"target":2}]}

    createNetwork(data);

    function createNetwork(data) {

        d3.select("svg#main").attr("height", visuHeight);

        var edges = data.edges;
        var nodes = data.nodes;



        var colors = ["#996666", "#ff9966", "#339999", "#6699cc", "#ffcc66", "#ff6600", "#00ccccc"];

    //This isn't "gravity" it's the visual centering of the network based on its mass
    var networkCenter = d3.forceCenter().x(visuWidth/2).y(visuHeight/2);

    //CHARGE
    var manyBody = d3.forceManyBody().strength(-150).distanceMax(100)



    //Make the x-position equal to the x-position specified in the module positioning object or, if not in
    //the hash, then set it to 250
    var forceX = d3.forceX().strength(0.05)

    //Same for forceY--these act as a gravity parameter so the different strength determines how closely
    //the individual nodes are pulled to the center of their module position
    var forceY = d3.forceY().strength(0.05)


    var force = d3.forceSimulation(nodes)
    .force("charge", manyBody)
    .force("link", d3.forceLink(edges).distance(fixedEdgeLength).iterations(1))
    .force("center", networkCenter)
    .force("x", forceX)
    .force("y", forceY)
    .on("tick", updateNetwork);

    var edgeEnter = d3.select("svg#main").selectAll("g.edge")
    .data(edges)
    .enter()
    .append("g")
    .attr("class", "edge");

    edgeEnter
    .append("line")
    .style("stroke", "black")
    .style("pointer-events", "none");

    var nodeEnter = d3.select("svg#main").selectAll("g.node")
    .data(nodes, function (d) {return d.pokedex_number})
    .enter()
    .append("g")
    .attr("class", "node")
     /*   .attr("fx", function(d){return d.id=="8" ? 130 : null})
     .attr("fy", function(d){return d.id=="8" ? 200 : null})*/

     nodeEnter.append("circle")
     .attr("r", 16)
     .style("fill", function (d) {return colors[d.module]})
     .style("stroke", "black")


    //  force.start();

    function updateNetwork(e) {
        d3.select("svg#main").selectAll("line")
        .attr("x1", function (d) {return d.source.x})
        .attr("y1", function (d) {return d.source.y})
        .attr("x2", function (d) {return d.target.x})
        .attr("y2", function (d) {return d.target.y});

        d3.select("svg#main").selectAll("g.node")
        .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});


    }

}

})