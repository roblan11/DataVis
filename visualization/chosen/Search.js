(function searchCreate() {

        //Create array of options to be added
        var array = ["Volvo","Saab","Mercades","Audi"];

        //body reference
        var body = document.getElementsByTagName("body")[0];
        var div1 = document.createElement('div');
        div1.setAttribute('class', 'side-by-side clearfix');

        var div2 = document.createElement('div');

        var select = document.createElement("SELECT");
        select.setAttribute('class', "chosen-select-deselect");
        select.setAttribute('data-placeholder', "Choose a Pokemon...");

        var option = document.createElement("OPTION");
        option.value = "";
        option.setAttribute('selected', true);
        select.appendChild(option);


        for (var i = 0; i < array.length; i++) {
          var options = document.createElement("OPTION");
          options.text = array[i];
          select.appendChild(options);
        }

        div2.appendChild(select)
        div1.appendChild(div2)
        document.body.appendChild(div1);

}).call(this);
