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




d3.csv("./data/pokemon_gen1.csv", function(data) {

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
 let nbLevel = nbPokemon/15

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

       const CP_W = d3.select("#current_pokemon").node().getBoundingClientRect().width
       const CP_H = d3.select("#current_pokemon").node().getBoundingClientRect().height
       
       const topbar_pos = {
           left: {
               xpos: 0, 
               width: 0.495*CP_W, 
               height: 0.4*CP_H, 
               margin: 0.02*CP_H, 
               id: "l_"
           },
           right: {
               xpos: 0.505*CP_W, 
               width: 0.495*CP_W, 
               height: 0.4*CP_H, 
               margin: 0.02*CP_H, 
               id: "r_"
           }
       }
       
       const topbar_attributes = [
           {pos: 0, id: "type", name: "type"},
           {pos: 1, id: "classif", name: "classification"}
       ]
       
       let cp_center = cp.append("g")
       let cp_hover = cp.append("g")
       
       function initTopBar (group, position) {
           let background = group.append("g")
           
           background.append("rect")
           .attr("x", position.xpos)
           .attr("y", 0)
           .attr("width", position.width)
           .attr("height", position.height)
           .attr("id", position.id + "type2_bg")
           
           const image_size = position.height - 2*position.margin
           
           let xcenter = 0
           
           if (position.id == "l_") {
               background.append("rect")
               .attr("x", position.xpos)
               .attr("y", position.margin)
               .attr("width", position.width - position.margin)
               .attr("height", position.height - 2*position.margin)
               .attr("id", position.id + "type1_bg")
               
               group.append("image")
               .attr("x", position.xpos + position.margin)
               .attr("y", position.margin)
               .attr("width", image_size)
               .attr("height", image_size)
               .attr("id", position.id + "top_img")
               
               group.append("text")
               .attr("x", position.xpos + 2*position.margin + image_size)
               .attr("y", position.margin + 20)
               .attr("id", position.id + "n_pokedex")
               
               xcenter = ((position.xpos + image_size) + (position.xpos + position.width)) / 2
           } else {
               background.append("rect")
               .attr("x", position.xpos + position.margin)
               .attr("y", position.margin)
               .attr("width", position.width - position.margin)
               .attr("height", position.height - 2*position.margin)
               .attr("id", position.id + "type1_bg")
               
               group.append("image")
               .attr("x", position.xpos + position.width - position.margin - image_size)
               .attr("y", position.margin)
               .attr("width", image_size)
               .attr("height", image_size)
               .attr("id", position.id + "top_img")
               
               group.append("text")
               .attr("x", position.xpos + position.width - 2*position.margin - image_size)
               .attr("y", position.margin + 20)
               .attr("id", position.id + "n_pokedex")
               
               xcenter = (position.xpos + (position.xpos + position.width - image_size)) / 2
           }
           
           group.append("text")
           .attr("x", xcenter)
           .attr("y", position.margin + 30)
           .attr("class", "desc_name")
           .attr("id", position.id + "desc_name")
           
           let attributes = group.append("g")
           
           let attrs_typename = attributes.append("g").attr("class", "desc_top_typename")
           let attrs_typeval = attributes.append("g").attr("class", "desc_top_typeval")
           
           for (let att of topbar_attributes) {
               const ypos = position.margin + 50 + att.pos*15
               
               attrs_typename.append("text")
               .attr("x", xcenter - position.margin)
               .attr("y", ypos)
               .text(att.name)

               attrs_typeval.append("text")
               .attr("x", xcenter + position.margin)
               .attr("y", ypos)
               .attr("id", position.id + att.id)
           }
       }
    
       function updateTopBar (group, position, pokemon) {
           group.select("#" + position.id + "type2_bg")
           .attr("fill", TYPE_COLOR[pokemon.type2])
           
           group.select("#" + position.id + "type1_bg")
           .attr("fill", TYPE_COLOR[pokemon.type1])
           
           group.select("#" + position.id + "top_img")
           .attr("href", "data/sprites/" + pokemon.pokedex_number + ".png")
           
           group.select("#" + position.id + "desc_name")
           .text(pokemon.name)
           
           group.select("#" + position.id + "n_pokedex")
           .text(pokemon.pokedex_number)
       
           if (pokemon.type1 == pokemon.type2) {
               group.select("#" + position.id + "type")
               .text(pokemon.type1)
           } else {
               group.select("#" + position.id + "type")
               .text(pokemon.type1 + " / " + pokemon.type2)
           }
       
           group.select("#" + position.id + "classif")
           .text(pokemon.classfication.replace("@@", ", "))
       }

       function updateDesc () {
           let curr_poke = data.filter(d => d.pokedex_number == currentId)[0]
           
           updateTopBar(cp_center, topbar_pos.right, curr_poke)
       }
    
       function hoverDesc (dex_num) {
           let hover_poke = data.filter(d => d.pokedex_number == dex_num)[0]
           
           updateTopBar(cp_hover, topbar_pos.left, hover_poke)
       }
       
       function initDesc () {
           initTopBar(cp_center, topbar_pos.right)
           initTopBar(cp_hover, topbar_pos.left)
           updateDesc()
       }

/****************************************************************************
 ******************************** CYTOSCAPE GRAPH ***************************
 ****************************************************************************/

    // TODO actually diable text rather than setting its size to 0...
    
 let stylesOptionsDefault = {
    'height': 20,
    'width': 20,
    "background-height": "80%",
    "background-width": "87%",
    "font-size": "0px",
    "content": "",
    'text-valign': 'bottom',
    'text-halign': 'center',
    "text-transform": "uppercase",
    "border-width": 4
}

let stylesOptionsCurrent = {
    "font-size": "0px",
    "width":40,
    "height":40
}

let stylesHover = {
    "width":40,
    "height":40
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

        data.forEach(n => {

            let stylesOptions = {}

            stylesOptions["background-color"] = TYPE_COLOR[n.type1];
            stylesOptions["border-color"] = TYPE_COLOR[n.type2];
            stylesOptions["background-image"] = "data/sprites/" + n.pokedex_number + ".png";


            let node = {
                data: {
                    id : n.pokedex_number,
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

    }


    function computeCloseness(){
        let updatedNodes = []

        cy.elements().toArray().forEach(n => {
            // compute closeness
            let closeness = 5
            let currentNode = cy.getElementById(currentId)

            let classification = n.data("classification").split("@@")
            let h = n.data("height")
            let w = n.data("weight")
            let type1 = n.data("type1")
            let type2 = n.data("type2")

            let classification_c = currentNode.data("classification").split("@@")
            let h_c = currentNode.data("height")
            let w_c = currentNode.data("weight")
            let type1_c = currentNode.data("type1")
            let type2_c = currentNode.data("type2")


            classification.forEach(c=>{
                classification_c.forEach(c1 => {
                    closeness += (c == c1) ? 1 : 0
                })
            })

            closeness -= rangeHeight(Math.abs(h_c - h))
            closeness -= rangeWeight(Math.abs(w_c - w))

            closeness += (type1 == type1_c || type1 == type2_c) ? 0.5 : 0
            closeness += (type2 == type1_c || type2 == type2_c) ? 0.5 : 0


            n.data("closeness", closeness)

            let node = {"closeness": closeness, "id": n.data("id")}

            updatedNodes.push(node)
        })

        updatedNodes = updatedNodes.sort((a,b) => b.closeness - a.closeness)

        console.log(updatedNodes)

        return updatedNodes
    }


    function computeLevelRange(updatedNodes){
        let closeness_min = updatedNodes[updatedNodes.length-1].closeness
        let closeness_max = updatedNodes[0].closeness

        //let rangeLevel = d3.scaleLinear().domain([closeness_max, closeness_min]).range([1,nbLevel])

        let rangeLevel = d3.scalePow().domain([0, nbPokemon-1]).range([1,nbLevel]).interpolate(d3.interpolateRound);
        return rangeLevel
    }


    function updateGraph(){

        console.log("update graph with current : " + currentId)

        let updatedNodes = computeCloseness()

        // sort 
        let rangeLevel = computeLevelRange(updatedNodes)


        // change level depending on array position
        for(let i = 0; i < updatedNodes.length; i++){

            let n = updatedNodes[i];
            let node = cy.getElementById(n.id)
            let stylesOptions = stylesOptionsDefault

            if(n.id == currentId) {
                l = 0
                stylesOptions = stylesOptionsCurrent

                stylesOptions["content"] = node.data("name");
                stylesOptions["background-color"] = TYPE_COLOR[node.data("type1")];
                stylesOptions["border-color"] = TYPE_COLOR[node.data("type2")];
                stylesOptions["background-image"] = "data/sprites/" + n.id + ".png";

            }
            else {
             /*   let cl = node.data("closeness")
                l = Math.round(rangeLevel(cl))
                console.log(l)*/

                l = rangeLevel(i)
            }

            node.style(stylesOptions)
            node.data("level",l)
            
        }
        
    }



    // just use the regular qtip api but on cy elements
    cy.on('mouseover', 'node', function(event) {
        let node = event.target;

        stylesHover['content'] = node.data("name");
        node.style(stylesHover)
        
        hoverDesc(node.data("id"))

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
    updateGraph()
    cy.layout(concentricOptions).run();
    
});
