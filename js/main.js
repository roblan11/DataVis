// js.cytoscape.org

visuWidth = window.innerWidth || document.body.clientWidth;
visuHeight = 600;

fixedEdgeLength = 100;

currentId = 25

TYPE_COLOR = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water" :  "#6390F0",
    "electric" :  "#F7D02C",
    "grass" :  "#7AC74C",
    "ice" :  "#96D9D6",
    "fighting" : "#C22E28",
    "poison" :  "#A33EA1",
    "ground" :  "#E2BF65",
    "flying" :  "#A98FF3",
    "psychic" :  "#F95587",
    "bug" :  "#A6B91A",
    "rock" :  "#B6A136",
    "ghost" :  "#735797",
    "dragon" :  "#6F35FC",
    "dark" :  "#705746",
    "steel" :  "#B7B7CE",
    "fairy" :  "#D685AD"
}


d3.csv("./data/pokemon.csv", function(data) {
    
/****************************************************************************
 ********************************** SEARCH **********************************
 ****************************************************************************/
    
    // TODO SEARCH POKEMON BY NAME
    // ? SEARCH OTHER FEATURES
    
/****************************************************************************
 ********************************* POKE PREVIEW *****************************
 ****************************************************************************/
    
    let cp = d3.select("#current_pokemon")
            .append("svg")
            .attr("height", "100%")
            .attr("width", "100%")
    
    const CP_W = d3.select("#current_pokemon").node().getBoundingClientRect().width
    const CP_H = d3.select("#current_pokemon").node().getBoundingClientRect().height
    
    let cp_bg = cp.append("g")
    
    const bg_rect = [
        {xpos: "0%", ypos:  "0%", width: "100%", height:  "20%", id: "type2_bg"},
        {xpos: "2%", ypos:  "2%", width:  "96%", height:  "16%", id: "type1_bg"},
        {xpos: "0%", ypos: "20%", width: "100%", height:  "80%", id: "bg"}
    ]
    
    for (let r of bg_rect) {
        cp_bg.append("rect")
            .attr("x", r.xpos)
            .attr("y", r.ypos)
            .attr("width", r.width)
            .attr("height", r.height)
            .attr("id", r.id)
    }
    
    const name = {xpos: "50%", ypos: "10%", id: "desc_name"}
    
    cp.append("text")
        .attr("x", name.xpos)
        .attr("y", name.ypos)
        .attr("id", name.id)
    
    let cp_r = cp.append("g")
                .attr("class", "desc_text")
    
    let cp_l = cp.append("g")
                .attr("class", "desc_sub")
    
    const x_meas = {left: "48%", right: "52%"}
    
    const types = [
        {ypos: CP_H*0.3, id: "type", name: "type"},
        {ypos: CP_H*0.3 + 15, id: "poke_num", name: "pokedex number"},
        {ypos: CP_H*0.3 + 30, id: "TODO", name: "whatevs"}
    ]
    
    for (let type of types) {
        cp_l.append("text")
            .attr("x", x_meas.left)
            .attr("y", type.ypos)
            .text(type.name)
        
        cp_r.append("text")
            .attr("x", x_meas.right)
            .attr("y", type.ypos)
            .attr("id", type.id)
    }
    
    let cp_img = cp.append("image")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", "20%")
                    .attr("height", "20%")
    
    // TODO add other stats
    
    function updateDesc(id) {
        
        let curr_poke = data.filter(d => d.pokedex_number == currentId)[0]
        
        cp_bg.select("#type1_bg")
            .attr("fill", TYPE_COLOR[curr_poke.type1])
        
        cp_bg.select("#type2_bg")
            .attr("fill", TYPE_COLOR[curr_poke.type2])
        
        cp.select("#desc_name")
            .text(curr_poke.name)
        
        cp_r.select("#type")
            .text(curr_poke.type1 + " / " + curr_poke.type2)
            .attr("fill", TYPE_COLOR[curr_poke.type1])
        
        cp_r.select("#poke_num")
            .text(id)
        
        cp_r.select("#TODO")
            .text(curr_poke.japanese_name)
        
        cp_img.attr("href", "data/sprites/" + id + ".png")
        
    }
    
    function initDesc() {
        cp_bg.select("#bg")
            .attr("fill", "white")
        
        updateDesc(currentId)
    }
        
/****************************************************************************
 ******************************** CYTOSCAPE GRAPH ***************************
 ****************************************************************************/

    let stylesOptionsDefault = {
        'height': 20,
        'width': 20,
        "background-height": "30%",
        "background-width": "37%",
        "font-size": "2px",
        "content": "",
        'text-valign': 'bottom',
        'text-halign': 'center',
        "text-transform": "uppercase"
    }

    let stylesOptionsCurrent = {
        "font-size": "3px",
        "width":30,
        "height":30
    }

    let stylesHover = {
        "width":30,
        "height":30
    }


    let cy = cytoscape({
        container: document.getElementById('cy'),

        style: [
        {
            selector: 'node',
            style: stylesOptionsDefault,
            autoungrabify: true
        }
        ]
    });



    let concentricOptions = {
        name: 'concentric',
        concentric: function(node) {
            return 10 - node.data('level');
        },
        levelWidth: function() {
            return 1;
        },
        animate: true
    };


    // init
    function initGraph() {
        data.forEach(n => {

            // You have to have threshold to know the level of the pokemon in the graph

            let l = 1; 
            let stylesOptions = {}
            let currentParam = 0

            if (n.pokedex_number == 25) {
                l = 0
                currentParam = 1
                stylesOptionsCurrent["content"] = n.name
                stylesOptions = stylesOptionsCurrent
            }

            stylesOptions["background-color"] = TYPE_COLOR[n.type1];
            stylesOptions["border-color"] = TYPE_COLOR[n.type2];
            stylesOptions["background-image"] = "data/sprites/" + n.pokedex_number + ".png";


            cy.add({
                data: {
                    id : n.pokedex_number,
                    level: l,
                    current: currentParam,
                    name: n.name,
                    type1 : n.type1,
                    type2: n.type2
                }, 
                style : stylesOptions
            })

        }) 

        cy.layout(concentricOptions).run();
    }


    function updateGraph(currentNode){

        currentId = currentNode.data("id")

        cy.elements().toArray().forEach(n => {
            let l = 1
            let stylesOptions = stylesOptionsDefault

            if (n.data("id") == currentId){
                l = 0

                stylesOptions = stylesOptionsCurrent

                stylesOptions["content"] = n.data("name");
                stylesOptions["background-color"] = TYPE_COLOR[n.data("type1")];
                stylesOptions["border-color"] = TYPE_COLOR[n.data("type2")];
                stylesOptions["background-image"] = "data/sprites/" + n.data("id") + ".png";


            }
            else {
            }
                n.data("level",l)
                n.style(stylesOptionsDefault)
        })
        
    }



    // just use the regular qtip api but on cy elements
    cy.on('mouseover', 'node', function(event) {
        let node = event.target;

        stylesHover['content'] = node.data("name");
        node.style(stylesHover)

    });

    // just use the regular qtip api but on cy elements
    cy.on('mouseout', 'node', function(event) {
        let node = event.target;


        if (node.data("id") == currentId) {
            node.style(stylesOptionsCurrent)
        }
        else {
            node.style(stylesOptionsDefault)

        }

    });


    // on click event
    cy.on('tap', 'node', function(evt){

        let node = evt.target;

        updateGraph(node)
        updateDesc(node.data("id"))

        // update graph
        cy.layout(concentricOptions).run();

    });
    
    initGraph()
    initDesc()
    
});
