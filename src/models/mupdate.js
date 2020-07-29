var m = require("mithril");
var utl = require("./utl");

var mupdate = {
    // Fields is needed for the same reason content on the homepage
    // is needed, because the ui needs a direct access to the fields of the layer
    // through an array to properly update with mithril
    fields: [],
    load_layer: (index) => {
        // Immediately reset the fields and load in the state        
        mupdate.fields = [];
        var state = JSON.parse(window.localStorage.getItem("state"));
        var itemName = state.content[index].name;

        if (state.fields[itemName] !== null && state.fields[itemName] !== undefined) {
            mupdate.fields = state.fields[itemName];
        }

        m.request({
            url: state.content[index].url + "/0?f=json&token=" + state.token,
            method: "GET",
        })
        .then((response) => {
            if (response.error == undefined) {
                mupdate.fields = response.fields;
                state.fields[itemName] = response.fields;
                window.localStorage.setItem("state", JSON.stringify(state));
            }
            else {
                utl.handle(response);
            }
        })
    },

    add: (index, form_input) => {    
        var state = JSON.parse(window.localStorage.getItem("state"));
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
        var itemName = state.content[index].name;
        var fieldsArray = state.fields[itemName];
        for (i = 1; i < fieldsArray.length; i++) {
            addInput.attributes[fieldsArray[i].name] = form_input[fieldsArray[i].name];
        }
        body.append("adds", JSON.stringify(addInput))

        // Add this request onto the pending for this specific layer
        if (state.pending[itemName] === null || state.pending[itemName] === undefined) {
            state.pending[itemName] = {};
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
                state.pending[itemName].push(addInput);
                window.localStorage.setItem("state", JSON.stringify(state));
                utl.handle(response);
            }
        })
    },
}

module.exports = mupdate;