// js.cytoscape.org

visuWidth = window.innerWidth || document.body.clientWidth;
visuHeight = 600;

fixedEdgeLength = 100;

currentId = 25

TYPE_COLOR = {
    "Normal": "#A8A77A",
    "Fire": "#EE8130",
    "Water" :  "#6390F0",
    "Electric" :  "#F7D02C",
    "Grass" :  "#7AC74C",
    "Ice" :  "#96D9D6",
    "Fighting" : "#C22E28",
    "Poison" :  "#A33EA1",
    "Ground" :  "#E2BF65",
    "Flying" :  "#A98FF3",
    "Psychic" :  "#F95587",
    "Bug" :  "#A6B91A",
    "Rock" :  "#B6A136",
    "Ghost" :  "#735797",
    "Dragon" :  "#6F35FC",
    "Dark" :  "#705746",
    "Steel" :  "#B7B7CE",
    "Fairy" :  "#D685AD"
}


d3.csv("https://raw.githubusercontent.com/roblan11/DataVis/master/data/pokemon.csv", function(pokemon) {

    data = {
        "nodes": [
        {"pokedex_number":"1", "type1":"Grass", "type2":"Grass", "name":"Bulbizarre", "classification":["bulb"] },
        {"pokedex_number":"2", "type1":"Grass", "type2":"Grass", "name":"Herbizaur", "classification":["bulb"] },
        {"pokedex_number":"4", "type1":"Fire", "type2":"Fire", "name":"Salameche", "classification":["lizard"] },
        {"pokedex_number":"5", "type1":"Water", "type2":"Water", "name":"Carapuce", "classification":["turtle"] },
        {"pokedex_number":"6", "type1":"Grass", "type2":"Grass", "name":"Herbizaur", "classification":["bulb"] },
        {"pokedex_number":"9", "type1":"Fire", "type2":"Fire", "name":"Salameche", "classification":["lizard"] },
        {"pokedex_number":"7", "type1":"Water", "type2":"Water", "name":"Carapuce", "classification":["turtle"] },
        {"pokedex_number":"25", "type1":"Electric", "type2":"Electric", "name":"Pikachu", "classification":["Mouse"] },

        ]
    }



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
            style: stylesOptionsDefault
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
        data.nodes.forEach(n => {

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
            stylesOptions["background-image"] = "data/icons/" + n.pokedex_number + ".png";


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
                stylesOptions["background-image"] = "data/icons/" + n.data("id") + ".png";


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

        // update graph
        cy.layout(concentricOptions).run();

    });




    initGraph()


});