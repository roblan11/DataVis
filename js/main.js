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




d3.csv("./data/pokemon_1.csv", function(data) {

    let heights = data.map(d => d.height_m)
    let rangeHeight = d3.scaleLinear().domain([d3.min(heights), d3.max(heights)]).range([0,1])

    let weights = data.map(d => d.weight_kg)
    let rangeWeight = d3.scaleLinear().domain([d3.min(weights), d3.max(weights)]).range([0,1])

/****************************************************************************
 ********************************** SEARCH **********************************
 ****************************************************************************/

    // TODO SEARCH POKEMON BY NAME
    // ? SEARCH OTHER FEATURES

/****************************************************************************
 ********************************* POKE PREVIEW *****************************
 ****************************************************************************/

    let nbPokemon = data.length
    let nbLevel = nbPokemon/10

    /* DATA ENTRIES TO SHOW
       name / pokedex_number
       type1 / type2
       height_m / weight_kg
       classification
     */

    let cp = d3.select("#current_pokemon")
            .append("svg")
            .attr("height", "100%")
            .attr("width", "100%")

    cp.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white")

    const CP_W = d3.select("#current_pokemon").node().getBoundingClientRect().width
    const CP_H = d3.select("#current_pokemon").node().getBoundingClientRect().height

    const top_rect = [
        {xpos: "0%", ypos:  "0%", width: "100%", height:  "40%", id: "type2_bg"},
        {xpos: "2%", ypos:  "2%", width:  "96%", height:  "36%", id: "type1_bg"}
    ]

    let cp_top = cp.append("g");

    for (let r of top_rect) {
        cp_top.append("rect")
            .attr("x", r.xpos)
            .attr("y", r.ypos)
            .attr("width", r.width)
            .attr("height", r.height)
            .attr("id", r.id)
    }

    const name = {xpos: "69%", ypos: CP_H*0.12, id: "desc_name"}

    cp_top.append("text")
        .attr("x", name.xpos)
        .attr("y", name.ypos)
        .attr("id", name.id)

    let cp_top_img = cp_top.append("image")
                    .attr("x", "2%")
                    .attr("y", "2%")
                    .attr("width", "36%")
                    .attr("height", "36%")

    const top_desc = {
        txt : [
            {pos: 0, id: "n_pokedex", name: "number"},
            {pos: 1, id: "type", name: "type"},
            {pos: 2, id: "classif", name: "classification"}
        ],
        xpos : {left: "68%", right: "70%"}

    }

    let cp_top_left = cp.append("g").attr("class", "desc_top_typename");
    let cp_top_right = cp.append("g").attr("class", "desc_top_typeval");

    for (let d of top_desc.txt) {
        let ypos = CP_H*0.2 + d.pos*15

        cp_top_left.append("text")
            .attr("x", top_desc.xpos.left)
            .attr("y", ypos)
            .text(d.name)

        cp_top_right.append("text")
            .attr("x", top_desc.xpos.right)
            .attr("y", ypos)
            .attr("id", d.id)
    }

    // --------------------------------------------------------------------------

//    let cp_bottom = cp.append("g")
//                .attr("class", "desc_text")
//
//    let cp_l = cp.append("g")
//                .attr("class", "desc_sub")
//
//    const x_meas = {left: "48%", right: "52%"}
//
//    const types = [
//        {pos: 0, id: "poke_num", name: "pokedex number"},
//        {pos: 1, id: "type1", name: "primary type"},
//        {pos: 2, id: "type2", name: "secondary type"},
//        {pos: 3, id: "height", name: "height [m]"},
//        {pos: 4, id: "weight", name: "weight [kg]"},
//        {pos: 5, id: "classif", name: "classification"}
//    ]
//
//    for (let type of types) {
//
//        let ypos = CP_H*0.5 + type.pos*15
//
//        cp_l.append("text")
//            .attr("x", x_meas.left)
//            .attr("y", ypos)
//            .text(type.name)
//
//        cp_r.append("text")
//            .attr("x", x_meas.right)
//            .attr("y", ypos)
//            .attr("id", type.id)
//    }

    function updateDesc() {

        let curr_poke = data.filter(d => d.pokedex_number == currentId)[0]

        cp_top.select("#type1_bg")
            .attr("fill", TYPE_COLOR[curr_poke.type1])

        cp_top.select("#type2_bg")
            .attr("fill", TYPE_COLOR[curr_poke.type2])

        cp_top.select("#desc_name")
            .text(curr_poke.name)

        cp_top_right.select("#n_pokedex")
            .text(currentId)

        if (curr_poke.type1 == curr_poke.type2) {
            cp_top_right.select("#type")
                .text(curr_poke.type1)
        } else {
            cp_top_right.select("#type")
                .text(curr_poke.type1 + " / " + curr_poke.type2)
        }

        cp_top_right.select("#classif")
            .text(curr_poke.classfication)

//        cp_r.select("#poke_num")
//            .text(id)
//
//        cp_r.select("#type1")
//            .text(curr_poke.type1)
//            .attr("fill", TYPE_COLOR[curr_poke.type1])
//
//        if (curr_poke.type1 == curr_poke.type2) {
//            cp_r.select("#type2")
//                .text("^^")
//                .attr("fill", "red")
//        } else {
//            cp_r.select("#type2")
//                .text(curr_poke.type2)
//                .attr("fill", TYPE_COLOR[curr_poke.type2])
//        }
//
//        cp_r.select("#height")
//            .text(curr_poke.height_m)
//
//        cp_r.select("#weight")
//            .text(curr_poke.weight_kg)
//
//        cp_r.select("#classif")
//            .text(curr_poke.classfication)

        cp_top_img.attr("href", "data/sprites/" + currentId + ".png")

    }

    function initDesc() {
        updateDesc(currentId)
    }

/****************************************************************************
 ******************************** CYTOSCAPE GRAPH ***************************
 ****************************************************************************/

    let stylesOptionsDefault = {
        'height': 20,
        'width': 20,
        "background-height": "70%",
        "background-width": "77%",
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
            style: stylesOptionsDefault
        }
        ],
        autoungrabify: true
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

        let updatedNodes = []

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


            let node = {
                data: {
                    id : n.pokedex_number,
                    level: l,
                    current: currentParam,
                    name: n.name,
                    type1 : n.type1,
                    type2: n.type2,
                    height: n.height_m,
                    weight: n.weight_kg,
                    classification: n.classfication
                }, 
                style : stylesOptions
            }
            cy.add(node)

        })

        // updatedNodes.forEach(n => {
        //     cy.add(n)
        // }) 

        cy.layout(concentricOptions).run();
    }


    function updateGraph(){

        let updatedNodes = []

        cy.elements().toArray().forEach(n => {
            let stylesOptions = stylesOptionsDefault

            if (n.data("id") == currentId){

                stylesOptions = stylesOptionsCurrent

                stylesOptions["content"] = n.data("name");
                stylesOptions["background-color"] = TYPE_COLOR[n.data("type1")];
                stylesOptions["border-color"] = TYPE_COLOR[n.data("type2")];
                stylesOptions["background-image"] = "data/sprites/" + n.data("id") + ".png";


            }
            else {
            }
            n.style(stylesOptions)

            // compute closeness
            let closeness = 0
            let currentNode = cy.getElementById(currentId)
            
            let classification = n.data("classification")
            let h = n.data("height")
            let w = n.data("weight")
            let type1 = n.data("type1")
            let type2 = n.data("type2")
            
            let classification_c = currentNode.data("classification")
            let h_c = currentNode.data("height")
            let w_c = currentNode.data("weight")
            let type1_c = currentNode.data("type1")
            let type2_c = currentNode.data("type2")


            /*classification.forEach(c=>{
                classification_c.forEach(c1 => {
                    closeness += (c == c1) ? 0.5 : 0
                })
            })*/

            closeness -= rangeHeight(Math.abs(h_c - h))
            closeness -= rangeWeight(Math.abs(w_c - w))


            n.data("closeness", closeness)

            let node = {"closeness": closeness, "id": n.data("id")}

            updatedNodes.push(node)
        })

        // sort 
        updatedNodes.sort((a,b) => a.closeness > b.closeness)
        console.log(updatedNodes)

        // change level depending on array position
        for(let i = 0; i < updatedNodes.length; i++){
            
            let n = updatedNodes[i];

            if(n.id == currentId) {
                l = 0
            }
            else {
                l = i%nbLevel + 1
            }

            cy.getElementById(n.id).data("level",l)
            
        }

        console.log(cy.getElementById(25).data("closeness"))
        
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

        currentId = node.data("id")

        updateGraph()
        updateDesc()

        // update graph
        cy.layout(concentricOptions).run();

    });
    
    initGraph()
    initDesc()
    
});
