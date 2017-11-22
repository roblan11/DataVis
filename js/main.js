// js.cytoscape.org


visuWidth = window.innerWidth || document.body.clientWidth;
visuHeight = 600;

fixedEdgeLength = 100;


d3.csv("https://raw.githubusercontent.com/roblan11/DataVis/master/data/pokemon.csv", function(pokemon) {

    data = {
        "nodes": [
        {"id":"0" },
        {"id":"12", "level":1},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"11", "level":2},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"12", "level":2},
        {"id":"11", "level":2},
        {"id":"12", "level":2},
        ]
    }



    let stylesOptionsDefault = {
        'height': 20,
        'width': 20,
        'background-color': '#30c9bc'
    }

    let stylesOptionsCurrent = {
        "background-color": "red",
        "width":50,
        "height":50,
        'background-image': ['data/icons/1.png']
    }

    var cy = cytoscape({
        container: document.getElementById('cy'),

        style: [
        {
            selector: 'node',
            style: stylesOptionsDefault
        }
        ]
    });



    var concentricOptions = {
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

            let l = 2; 
            let stylesOptions = {}
            let currentParam = 0

            if (n.id == 0) {
                l = 0
                currentParam = 1
                stylesOptions = stylesOptionsCurrent
            }

            cy.add({
                data: {
                    level: l,
                    current: currentParam
                }, 
                style : stylesOptions
            })

        }) 

        cy.layout(concentricOptions).run();
    }


    function updateGraph(currentNode){
        cy.elements().toArray().forEach(n => {
            if (n == currentNode){
                n.data("level",0)
                n.style(stylesOptionsCurrent)

            }
            else {
                n.data("level",1)
                n.style(stylesOptionsDefault)
            }
        })
    }




    // on click event
    cy.on('tap', 'node', function(evt){

        node = evt.target;

        /*old_current = cy.elements("node[current=1]")
        console.log(old_current.data())

        old_current.data("current", 0)
        node.data("current", 1)*/

        updateGraph(node)

        // update graph
        cy.layout(concentricOptions).run();

    });



    initGraph()


});
