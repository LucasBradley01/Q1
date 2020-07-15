var m = require("mithril");
var err = require("./error");

var mupdate = {
    init: () => {
        var rawState = window.localStorage.getItem("state");
        if (rawState === null) {
            m.route.set("/login");
            return;
        }

        var state = JSON.parse(rawState);
        var currentTime = new Date();
        if (state.expires === null || state.expires < currentTime.getTime()) {
            m.route.set("/login");
            return;
        }  
    },

    // Fields is needed for the same reason content is needed,
    // because the ui needs a direct access to the fields of the layer
    // through an array to properly update with mithril
    fields: [],
    load_layer: (index) => {
        // Immediately rest the fields and load in the state
        mupdate.fields = [];
        var state = JSON.parse(window.localStorage.getItem("state"));

        m.request({
            url: state.content[index].url + "/0?f=json&token=" + state.token,
            method: "GET",
        })
        .then((response) => {
            if (response.error == undefined) {
                mupdate.fields = response.fields;
                state.content[index].fields = response.fields;
                window.localStorage.setItem("state", JSON.stringify(state));
            }
            else {
                err.handle(response);
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
        var add_input = {
            "geometry": {
                "x": form_input.longitude,
                "y": form_input.latitude,
            },
            "attributes": {}
        }

        // We begin at 1 because element 0 is object id which we do not want
        // to push to ArcGIS, this is because ArcGIS internally and automatically
        // calculated OBJECTID
        var fields_array = state.content[index].fields;
        for (i = 1; i < fields_array.length; i++) {
            add_input.attributes[fields_array[i].name] = form_input[fields_array[i].name];
        }
        body.append("adds", JSON.stringify(add_input))

        m.request({
            url: state.content[index].url + "/0/applyEdits",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                
            }
            else {
                err.handle(response);
            }
        })
    },
}

module.exports = mupdate;