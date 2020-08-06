var m = require("mithril");
var utl = require("./utl");

var add = {
    // Fields is needed for the same reason content on the homepage
    // is needed, because the ui needs a direct access to the fields of the layer
    // through an array to properly add with mithril
    fields: [],
    loadLayer: (index) => {
        // Immediately reset the fields and load in the state        
        add.fields = [];

        var state = JSON.parse(localStorage.getItem("state"));

        if (state.fields[index] !== null && state.fields[index] !== undefined) {
            add.fields = state.fields[index];
        }

        m.request({
            url: state.content[index].url + "/0?f=json&token=" + state.token,
            method: "GET",
        })
        .then((response) => {
            if (response.error == undefined) {
                add.fields = response.fields;
                state.fields[index] = response.fields;
                localStorage.setItem("state", JSON.stringify(state));
            }
            else {
                utl.handle(response);
            }
        })
    },

    add: (index, form_input) => {    
        var state = JSON.parse(localStorage.getItem("state"));
        
        var body = new FormData();
        body.append("f", "json");
        body.append("token", state.token);
        // This is the format for the adds field. There needs to be geometry
        // where x and y correspond to longitude and latitude respectively,
        // and attributes to determine what each field equals.
        var addInput = {
            "geometry": {
                "x": form_input.longitude,
                "y": form_input.latitude,
            },
            "attributes": {}
        }

        // We begin at 1 because element 0 is object id which we do not want
        // to push to ArcGIS, this is because ArcGIS internally and automatically
        // calculates OBJECTID
        var fieldsArray = state.fields;
        for (i = 1; i < fieldsArray.length; i++) {
            addInput.attributes[fieldsArray[i].name] = form_input[fieldsArray[i].name];
        }
        body.append("adds", JSON.stringify(addInput))

        // Add this request onto the pending for this specific layer
        if (!state.pending[index]) {
            state.pending[index] = {};
        }

        m.request({
            url: state.content[index].url + "/0/applyEdits",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error === undefined) {

            }
            else {
                state.pending[index].push(addInput);
                localStorage.setItem("state", JSON.stringify(state));
                utl.handle(response);
            }
        })
    },
}

module.exports = add;