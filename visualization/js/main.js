
// TODOS:
//  - update sprites

// window size : auto on width
let visuWidth = window.innerWidth || document.body.clientWidth;
let visuHeight = 600;

// default values
let defaultWidth = 10
let defaultHeight = 10
let fixedEdgeLength = 100;
let zoomlevel = 4
let closenessScalar = 5
let defaultHoverColor = "red"

// default current node : Pikachu
let currentId = 25

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


let legend = document.getElementById("legend");
var keys = Object.keys(TYPE_COLOR).sort();
for (var i=0; i<keys.length; i++) {
  let patch = document.createElement("div");
  patch.style.background = (TYPE_COLOR[keys[i]])
  patch.className = "patch"
  let text = document.createElement("div");
  text.className ="text"
  text.innerHTML = keys[i]

  legend.appendChild(patch);
  legend.appendChild(text);
  legend.appendChild(document.createElement("br"));
}



d3.csv("./data/pokemon.csv", function(data) {

  // scales to compute closeness and display bar chart
  let heights = data.map(d => +d.height_m)
  let rangeHeight = d3.scaleLinear().domain([0, d3.max(heights)]).range([0,1])

  let weights = data.map(d => +d.weight_kg)
  let rangeWeight = d3.scaleLinear().domain([0, d3.max(weights)]).range([0,1])
  
  let attacks = data.map(d => +d.attack)
  let rangeAttack = d3.scaleLinear().domain([0, d3.max(attacks)]).range([0,1])

  let defenses = data.map(d => +d.defense)
  let rangeDefense = d3.scaleLinear().domain([0, d3.max(defenses)]).range([0,1])
  
  let hps = data.map(d => +d.hp)
  let rangeHP = d3.scaleLinear().domain([0, d3.max(hps)]).range([0,1])
  
  let speeds = data.map(d => +d.speed)
  let rangeSpeed = d3.scaleLinear().domain([0, d3.max(speeds)]).range([0,1])



/****************************************************************************
 ********************************** CHECKBOXES ******************************
 ****************************************************************************/

// inputs are all checked
let speed_checked = true;
let hp_checked = true;
let att_checked = true;
let def_checked = true;
let h_checked = true;
let w_checked = true;
let class_checked = true;
let types_checked = true;


// callbacks
$('#speed').on('change', function() {
  speed_checked = this.checked
  updateGraph()
  setAccent("speed", speed_checked)
});
$('#hp').on('change', function() {
  hp_checked = this.checked
  updateGraph()
  setAccent("hp", hp_checked)
});
$('#att').on('change', function() {
  att_checked = this.checked
  updateGraph()
  setAccent("a", att_checked)
});
$('#def').on('change', function() {
  def_checked = this.checked
  updateGraph()
  setAccent("d", def_checked)
});
$('#he').on('change', function() {
  h_checked = this.checked
  updateGraph()
  setAccent("h", h_checked)
});
$('#we').on('change', function() {
  w_checked = this.checked
  updateGraph()
  setAccent("w", w_checked)
});
$('#types').on('change', function() {
  types_checked = this.checked
  updateGraph()
  setAccent("type", types_checked)
});
$('#classification').on('change', function() {
  class_checked = this.checked
  updateGraph()
  setAccent("classif", class_checked)
});


/****************************************************************************
 ********************************** SEARCH **********************************
 ****************************************************************************/

 let ids_names = data.map(d => [d.pokedex_number, d.name])

 let search = d3.select("#search_wrapper")

 let select_ = search.append("select")
 .attr("class", "my_select_box")
 .attr("data-placeholder", "Choose a Pokemon...")

 select_.append("option").attr("value", " ")

 for (let i of ids_names) {
   select_.append("option")
   .attr("value", i[0])
   .text(i[1])
 }

 $('.my_select_box').chosen({
   allow_single_deselect: true,
   width: "100%",
   search_contains: true
 });


 $('.my_select_box').on('change', function(evt, params) {
  zoomToId(parseInt(params.selected))
  hoverDesc(parseInt(params.selected))
});


/****************************************************************************
 ********************************* POKEMON PREVIEW *****************************
 ****************************************************************************/

 let nbPokemon = data.length
 let nbLevel = nbPokemon/20

    /* DATA ENTRIES TO SHOW
       name / pokedex_number
       type1 / type2
       height_m / weight_kg
       classification
       */

 // GENERAL DEFINITIONS AND CONSTANTS -----------------------------------------------

 let cp = d3.select("#current_pokemon").append("svg")
 .attr("height", "100%")
 .attr("width", "100%")

 const CP_W = d3.select("#current_pokemon").node().getBoundingClientRect().width
 const CP_H = d3.select("#current_pokemon").node().getBoundingClientRect().height

 // TOPBAR --------------------------------------------------------------------------

 const topbar_pos = {
   left: {
     xpos: 0, 
     id: "l_"
   },
   right: {
     xpos: 0.505*CP_W, 
     id: "r_"
   },
   general: {
     width: 0.495*CP_W, 
     height: 0.4*CP_H, 
     margin: 0.02*CP_H
   },
   text: {
     name_font_size: 0.12*CP_H,
     text_font_size: 0.06*CP_H,
     n_pokedex_font_size: 0.06*CP_H
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
   .attr("width", topbar_pos.general.width)
   .attr("height", topbar_pos.general.height)
   .attr("id", position.id + "type2_bg")

   const image_size = topbar_pos.general.height - 2*topbar_pos.general.margin

   let xcenter = 0

   if (position.id == "l_") {
     background.append("rect")
     .attr("x", position.xpos)
     .attr("y", topbar_pos.general.margin)
     .attr("width", topbar_pos.general.width - topbar_pos.general.margin)
     .attr("height", topbar_pos.general.height - 2*topbar_pos.general.margin)
     .attr("id", position.id + "type1_bg")

     group.append("image")
     .attr("x", position.xpos + topbar_pos.general.margin)
     .attr("y", topbar_pos.general.margin)
     .attr("width", image_size)
     .attr("height", image_size)
     .attr("id", position.id + "top_img")

     group.append("text")
     .attr("x", position.xpos + 2*topbar_pos.general.margin + image_size)
     .attr("y", (topbar_pos.general.height + topbar_pos.text.n_pokedex_font_size)/2)
     .attr("id", position.id + "n_pokedex")
     .style("font-size", topbar_pos.text.n_pokedex_font_size)

     xcenter = ((position.xpos + image_size) + (position.xpos + topbar_pos.general.width)) / 2

   } else {

     background.append("rect")
     .attr("x", position.xpos + topbar_pos.general.margin)
     .attr("y", topbar_pos.general.margin)
     .attr("width", topbar_pos.general.width - topbar_pos.general.margin)
     .attr("height", topbar_pos.general.height - 2*topbar_pos.general.margin)
     .attr("id", position.id + "type1_bg")

     group.append("image")
     .attr("x", position.xpos + topbar_pos.general.width - topbar_pos.general.margin - image_size)
     .attr("y", topbar_pos.general.margin)
     .attr("width", image_size)
     .attr("height", image_size)
     .attr("id", position.id + "top_img")

     group.append("text")
     .attr("x", position.xpos + topbar_pos.general.width - 2*topbar_pos.general.margin - image_size)
     .attr("y", (topbar_pos.general.height + topbar_pos.text.n_pokedex_font_size)/2)
     .attr("id", position.id + "n_pokedex")
     .style("font-size", topbar_pos.text.n_pokedex_font_size)

     xcenter = (position.xpos + (position.xpos + topbar_pos.general.width - image_size)) / 2
   }

   group.append("text")
   .attr("x", xcenter)
   .attr("y", topbar_pos.general.margin*2 + topbar_pos.text.name_font_size)
   .attr("class", "desc_name")
   .attr("id", position.id + "desc_name")
   .style("font-size", topbar_pos.text.name_font_size)

   let attributes = group.append("g")

   let attrs_typename = attributes.append("g").attr("class", "desc_top_typename")
   let attrs_typeval = attributes.append("g").attr("class", "desc_top_typeval")

   for (let att of topbar_attributes) {
     const ypos = CP_H*0.25 + att.pos*(topbar_pos.text.text_font_size + topbar_pos.general.margin)

     attrs_typename.append("text")
     .attr("x", xcenter - topbar_pos.general.margin)
     .attr("y", ypos)
     .style("font-size", topbar_pos.text.text_font_size)
     .text(att.name)

     attrs_typeval.append("text")
     .attr("x", xcenter + topbar_pos.general.margin)
     .attr("y", ypos)
     .attr("id", position.id + att.id)
     .style("font-size", topbar_pos.text.text_font_size)
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
   .text(pokemon.classfication.replace(/@@/g, ", "))
 }

// BUTTERFLY CHART -----------------------------------------------------------------

let cp_chart = cp.append("g").attr("id", "butterfly_chart")
let cp_chart_hover = cp_chart.append("g").attr("id", "butterfly_chart_left")
let cp_chart_center = cp_chart.append("g").attr("id", "butterfly_chart_right")
let cp_chart_attrs = cp_chart.append("g").attr("id", "butterfly_chart_attrs")

const chart_pos = {
 left: {
   xpos: 0.45*CP_W, 
   id: "l_"
 },
 right: {
   xpos: 0.55*CP_W, 
   id: "r_"
 },
 general: {
   bar_width: 0.3*CP_W, 
   bar_height: 0.08*CP_H, 
   bar_margin: 0.02*CP_H
 },
 text: {
   font_size: 0.06*CP_H,
   font_margin: 0.01*CP_W
 },
 transition: {
   duration: 500
 }

}

const chart_attributes = [
{pos: 0, id: "height", name: "height"},
{pos: 1, id: "weight", name: "weight"},
{pos: 2, id: "attack", name: "attack"},
{pos: 3, id: "defense", name: "defense"},
{pos: 4, id: "hp", name: "HP"},
{pos: 5, id: "speed", name: "speed"}
]

function initChart () {
 for (let att of chart_attributes) {
   const ypos = CP_H*0.4 + chart_pos.general.bar_margin*0.5 + att.pos*(chart_pos.general.bar_margin + chart_pos.general.bar_height) 

   cp_chart_attrs.append("text")
   .attr("x", 0.5*CP_W)
   .attr("y", ypos + chart_pos.text.font_size)
   .style("font-size", chart_pos.text.font_size)
   .text(att.name)

   cp_chart_hover.append("rect")
   .attr("x", chart_pos.left.xpos)
   .attr("y", ypos)
   .attr("width", 0)
   .attr("height", chart_pos.general.bar_height)
   .attr("id", chart_pos.left.id + att.id + "_rect")

   cp_chart_hover.append("text")
   .attr("x", chart_pos.left.xpos - chart_pos.text.font_margin)
   .attr("y", ypos + chart_pos.text.font_size)
   .attr("id", chart_pos.left.id + att.id)
   .style("font-size", chart_pos.text.font_size)

   cp_chart_center.append("rect")
   .attr("x", chart_pos.right.xpos)
   .attr("y", ypos)
   .attr("width", 0)
   .attr("height", chart_pos.general.bar_height)
   .attr("id", chart_pos.right.id + att.id + "_rect")

   cp_chart_center.append("text")
   .attr("x", chart_pos.right.xpos - chart_pos.text.font_margin)
   .attr("y", ypos + chart_pos.text.font_size)
   .attr("id", chart_pos.right.id + att.id)
   .style("font-size", chart_pos.text.font_size)
 }
}

function updateCenterChart (pokemon) {
 cp_chart_center.select("#r_height_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeHeight(pokemon.height_m)*chart_pos.general.bar_width)

 cp_chart_center.select("#r_weight_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeWeight(pokemon.weight_kg)*chart_pos.general.bar_width)

 cp_chart_center.select("#r_attack_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeAttack(pokemon.attack)*chart_pos.general.bar_width)

 cp_chart_center.select("#r_defense_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeDefense(pokemon.defense)*chart_pos.general.bar_width)

 cp_chart_center.select("#r_hp_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeHP(pokemon.hp)*chart_pos.general.bar_width)

 cp_chart_center.select("#r_speed_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("width", rangeSpeed(pokemon.speed)*chart_pos.general.bar_width)


 cp_chart_center.select("#r_height")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeHeight(pokemon.height_m)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.height_m)

 cp_chart_center.select("#r_weight")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeWeight(pokemon.weight_kg)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.weight_kg)

 cp_chart_center.select("#r_attack")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeAttack(pokemon.attack)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.attack)

 cp_chart_center.select("#r_defense")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeDefense(pokemon.defense)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.defense)

 cp_chart_center.select("#r_hp")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeHP(pokemon.hp)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.hp)

 cp_chart_center.select("#r_speed")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.right.xpos + rangeSpeed(pokemon.speed)*chart_pos.general.bar_width + chart_pos.text.font_margin)
 .text(pokemon.speed)
}

function updateHoverChart (pokemon) {
 cp_chart_hover.select("#l_height_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeHeight(pokemon.height_m)*chart_pos.general.bar_width)
 .attr("width", rangeHeight(pokemon.height_m)*chart_pos.general.bar_width)

 cp_chart_hover.select("#l_weight_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeWeight(pokemon.weight_kg)*chart_pos.general.bar_width)
 .attr("width", rangeWeight(pokemon.weight_kg)*chart_pos.general.bar_width)

 cp_chart_hover.select("#l_attack_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeAttack(pokemon.attack)*chart_pos.general.bar_width)
 .attr("width", rangeAttack(pokemon.attack)*chart_pos.general.bar_width)

 cp_chart_hover.select("#l_defense_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeDefense(pokemon.defense)*chart_pos.general.bar_width)
 .attr("width", rangeDefense(pokemon.defense)*chart_pos.general.bar_width)

 cp_chart_hover.select("#l_hp_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeHP(pokemon.hp)*chart_pos.general.bar_width)
 .attr("width", rangeHP(pokemon.hp)*chart_pos.general.bar_width)

 cp_chart_hover.select("#l_speed_rect")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeSpeed(pokemon.speed)*chart_pos.general.bar_width)
 .attr("width", rangeSpeed(pokemon.speed)*chart_pos.general.bar_width)


 cp_chart_hover.select("#l_height")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeHeight(pokemon.height_m)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.height_m)

 cp_chart_hover.select("#l_weight")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeWeight(pokemon.weight_kg)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.weight_kg)

 cp_chart_hover.select("#l_attack")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeAttack(pokemon.attack)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.attack)

 cp_chart_hover.select("#l_defense")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeDefense(pokemon.defense)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.defense)

 cp_chart_hover.select("#l_hp")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeHP(pokemon.hp)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.hp)

 cp_chart_hover.select("#l_speed")
 .transition().duration(chart_pos.transition.duration).ease(d3.easeQuadInOut)
 .attr("x", chart_pos.left.xpos - rangeSpeed(pokemon.speed)*chart_pos.general.bar_width - chart_pos.text.font_margin)
 .text(pokemon.speed)
}

// CALL FUNCTIONS -------------------------------------------------------------------

function setAccent (attribute, value) {
 const opacity = value ? 1 : 0.5
 
 if (attribute == "type" || attribute == "classif") {
  cp_center.select("#r_" + attribute).attr("opacity", opacity)
  cp_hover.select("#l_" + attribute).attr("opacity", opacity)
} else if (attribute == "a") {
  setAccent("attack", value)
} else if (attribute == "d") {
  setAccent("defense", value)
} else if (attribute == "h") {
  setAccent("height", value)
} else if (attribute == "w") {
  setAccent("weight", value)
} else {
  cp_chart.select("#r_" + attribute).attr("opacity", opacity)
  cp_chart.select("#r_" + attribute + "_rect").attr("opacity", opacity)
  cp_chart.select("#l_" + attribute).attr("opacity", opacity)
  cp_chart.select("#l_" + attribute + "_rect").attr("opacity", opacity)
}
}

function updateDesc () {
 let curr_poke = data.filter(d => d.pokedex_number == currentId)[0]

 updateTopBar(cp_center, topbar_pos.right, curr_poke)
 updateCenterChart(curr_poke)
}

function hoverDesc (dex_num) {
 let hover_poke = data.filter(d => d.pokedex_number == dex_num)[0]

 updateTopBar(cp_hover, topbar_pos.left, hover_poke)
 updateHoverChart(hover_poke)
}

function initDesc () {
 initTopBar(cp_center, topbar_pos.right)
 initTopBar(cp_hover, topbar_pos.left)
 initChart()

 hoverDesc(currentId)
 updateDesc()
}

/****************************************************************************
 ******************************** CYTOSCAPE GRAPH ***************************
 ****************************************************************************/

 let stylesOptionsDefault = {
  'height': 30,
  'width': 30,
  "background-height": "80%",
  "background-width": "87%",
  'text-valign': 'bottom',
  'text-halign': 'center',
  "text-transform": "uppercase",
  "border-width": 4
}

let stylesOptionsCurrent = {
  "width":50,
  "height":50
}

let stylesHover = {
  "width":40,
  "height":40,
  "background-color": defaultHoverColor,
  "border-color": defaultHoverColor
}


let cy = cytoscape({
  container: document.getElementById('cy'),

  style: [
  {
    selector: 'node',
    style: stylesOptionsDefault
  }
  ],
  autoungrabify: true,
  minZoom:0.1,
  maxZoom:3,
  minNodeSpacing:2
});




let concentricOptions = {
  name: 'concentric',
  concentric: function(node) {
    return 10 - node.data('level');
  },
  levelWidth: function() {
    return 1;
  },
  animate: true,
  fit: false,
  animationDuration: 1000,
  spacingFactor: 0.9
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
            id : +n.pokedex_number,
            name: n.name,
            type1 : n.type1,
            type2: n.type2,
            height: +n.height_m,
            weight: +n.weight_kg,
            classification: n.classfication,
            attack: +n.attack,
            defense: +n.defense,
            hp: +n.hp,
            speed: +n.speed,
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
            let closeness = 0
            let currentNode = cy.getElementById(currentId)

            if(class_checked) {
              let classification = n.data("classification").split("@@")
              let classification_c = currentNode.data("classification").split("@@")
              classification.forEach(c => {
                classification_c.forEach(c1 => {
                  closeness += (c == c1) ? 1 : 0
                })
              })
            }

            if(h_checked){
              let h = n.data("height")
              let h_c = currentNode.data("height")
              closeness -= 2*rangeHeight(Math.abs(h_c - h))
            }

            if(w_checked){
              let w = n.data("weight")
              let w_c = currentNode.data("weight")
              closeness -= 2*rangeWeight(Math.abs(w_c - w))
            }

            if(types_checked){
              let type1 = n.data("type1")
              let type2 = n.data("type2")
              let type1_c = currentNode.data("type1")
              let type2_c = currentNode.data("type2")
              
              let closeness_tmp = 0;
              if(type1 == type1_c && type2 == type2_c) {
                  closeness_tmp += 1
              } else {
                  closeness_tmp += (type1 == type1_c) ? 0.5 : 0
                  closeness_tmp += (type2 == type2_c) ? 0.25 : 0
                  closeness_tmp += (type1 == type2_c) ? 1/8 : 0
                  closeness_tmp += (type2 == type1_c) ? 1/8 : 0
              }
              closeness -= (1 - closeness_tmp)
            }

            if(att_checked){
              let a = n.data("attack")
              let a_c = currentNode.data("attack")
              closeness -= 2*rangeAttack(Math.abs(a_c - a))
            }

            if(def_checked){
              let d = n.data("defense")
              let d_c = currentNode.data("defense")
              closeness -= 2*rangeDefense(Math.abs(d_c - d))
            }

            if(hp_checked){
              let hp = n.data("hp")
              let hp_c = currentNode.data("hp")
              closeness -= 2*rangeHP(Math.abs(hp_c - hp))
            }

            if(speed_checked){
              let speed = n.data("speed")
              let speed_c = currentNode.data("speed")
              closeness -= 2*rangeSpeed(Math.abs(speed_c - speed))
            }

            n.data("closeness", closeness)
            let node = {"closeness": closeness, "id": n.data("id")}

            updatedNodes.push(node)
          })

      updatedNodes = updatedNodes.sort((a,b) => b.closeness - a.closeness)
      /*closenesses = updatedNodes.map(n => n.closeness)
      let rangeCompute = d3.scaleLinear().domain([d3.min(closenesses), d3.max(closenesses)]).range([0,1])
      updatedNodes = updatedNodes.map(function(n) { return {"closeness": rangeCompute(n.closeness), "id": n.id}} )*/

      return updatedNodes
    }


    function computeLevelRange(updatedNodes){
      let closeness_min = updatedNodes[updatedNodes.length-1].closeness
      let closeness_max = updatedNodes[0].closeness

      let rangeLevel = d3.scaleLinear().domain([closeness_min, closeness_max]).range([nbLevel,1]).clamp(true)

        //let rangeLevel = d3.scalePow().domain([0, nbPokemon-1]).range([1,nbLevel]).interpolate(d3.interpolateRound);
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

            stylesOptions["background-image"] = "data/sprites/" + n.id + ".png";

          }
          else {
            l = Math.round(rangeLevel(n.closeness))

            //l = rangeLevel(i)
          }

          stylesOptions["background-color"] = TYPE_COLOR[node.data("type1")];
          stylesOptions["border-color"] = TYPE_COLOR[node.data("type2")];
          node.style(stylesOptions)
          // node.style("height", defaultHeight + closenessScalar*(n.closeness))
          // node.style("width", defaultWidth + closenessScalar*(n.closeness))
          node.data("level",l)

        }
        
        cy.layout(concentricOptions).run();

      }



    // just use the regular qtip api but on cy elements
    cy.on('mouseover', 'node', function(event) {
      let node = event.target;

      if (node.data("id") == currentId) {
        node.style(stylesOptionsCurrent)
        node.style({"background-color": defaultHoverColor})
        node.style({"border-color": defaultHoverColor})
      }
      else {
        let levelNodes = cy.elements("[level =" + node.data("level") + "]")
        levelNodes.forEach(n => {
          n.style(stylesHover)
        })
      }

      hoverDesc(node.data("id"))

    });

    // just use the regular qtip api but on cy elements
    cy.on('mouseout', 'node', function(event) {
      let node = event.target;


      if (node.data("id") == currentId) {
        node.style(stylesOptionsCurrent)
        node.style({"background-color": TYPE_COLOR[node.data("type1")]})
        node.style({"border-color": TYPE_COLOR[node.data("type2")]})
      }
      else {

        let levelNodes = cy.elements("[level =" + node.data("level") + "]")
        levelNodes.forEach(n => {
          n.style(stylesOptionsDefault)
          n.style({"border-color":TYPE_COLOR[n.data("type2")]})
          n.style({"background-color":TYPE_COLOR[n.data("type1")]})
        })
        

        // node.style("height", defaultHeight + closenessScalar*(node.data("closeness")))
        // node.style("width", defaultWidth + closenessScalar*(node.data("closeness")))

      }

    });


    // on click event
    cy.on('tap', 'node', function(evt){

      let node = evt.target;

      zoomToId(currentId, true)
      currentId = node.data("id")

      updateGraph()
      updateDesc()

      cy.layout(concentricOptions).run();

    });


    function zoomToId(id, onclick=false){

      let node = cy.getElementById(id)
      let pos = node.position()
      let obj
      if (onclick) {
        obj = ((cy.zoom() < 2)) ?  { center: { eles: node }  } : { zoom: 2, center: { eles: node }  }
      }
      else {
        obj = { zoom: zoomlevel, center: { eles: node }  }
      }
      cy.animate(obj)

    }


    // init graph
    initGraph()
    initDesc()
    updateGraph()
    cy.animate({
      zoom: {
        level:2,
        position: {x:visuWidth/2, y:visuHeight/2}
      }
    })


    
  });
