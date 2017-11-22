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
    data = {
        "nodes": [
        {"id":"8", "fx": visuWidth/2, "fy": visuHeight/2, "current":1 },
        {"id":"9"},
        {"id":"19"},
        {"id":"11"},
        {"id":"12"},
        {"id":"12"},
        {"id":"12"},
        {"id":"12"},
        {"id":"12"},
        {"id":"11"},
        {"id":"11"},
        {"id":"11"},
        {"id":"11"},
        {"id":"11"},
        ]
    }

    createForceGraph(data);

    function createForceGraph(data) {

        d3.select("svg#main").attr("height", visuHeight);

        var edges = data.edges;
        var nodes = data.nodes;



        var colors = ["#996666", "#ff9966", "#339999", "#6699cc", "#ffcc66", "#ff6600", "#00ccccc"];

    //This isn't "gravity" it's the visual centering of the network based on its mass
    var center = d3.forceCenter().x(visuWidth/2).y(visuHeight/2);

    //CHARGE
    var manyBody = d3.forceManyBody().strength(-50).distanceMin(0)


    //Make the x-position equal to the x-position specified in the module positioning object or, if not in
    //the hash, then set it to 250
    var forceX = d3.forceX().strength(0.05)

    //Same for forceY--these act as a gravity parameter so the different strength determines how closely
    //the individual nodes are pulled to the center of their module position
    var forceY = d3.forceY().strength(0.05)


    var force = d3.forceSimulation(nodes)
    .force("charge", manyBody)
    .force("center", center)
    .force("x", forceX)
    .force("y", forceY)
    .on("tick", updateForceGraph);


    var nodeEnter = d3.select("svg#main").selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
     /*   .attr("fx", function(d){return d.id=="8" ? 130 : null})
     .attr("fy", function(d){return d.id=="8" ? 200 : null})*/

     nodeEnter.append("circle")
     .attr("r", function(d) {return d.current ? 30 : 15 })
     .style("fill", function (d) {return d.id%2 ? "black" : "red"})
     .style("stroke", "black")


    //  force.start();

    function updateForceGraph(e) {
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