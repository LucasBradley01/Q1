var m = require("mithril");
var err = require("../models/error_handler");

// Session is the used by the 
var session = {
    // Init organizes the data to be used by this session
    init: () => {
        sessionStorage.setItem("state", JSON.stringify({
            username: null,
            token: null,
            expires: null,
            content: [],
        }));
    },

    // Login is tasked with generating a token for the session
    login: (username, password) => {
        // The body of the request is arranged here
        var body = new FormData();
        // Determine return format
        body.append("f", "json");
        body.append("username", username);
        body.append("password", password);
        body.append("referer", "https://www.arcgis.com");
        // How long a token will be valid in minutes
        body.append("expiration", "480");
        
        // XML call to generate a token from arcgis
        return m.request({
            url: "https://www.arcgis.com/sharing/rest/generateToken",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.token) {
                var state = JSON.parse(sessionStorage.getItem("state"));
                state.username = username;
                state.token = response.token;
                state.expires = response.expires;
                sessionStorage.setItem("state", JSON.stringify(state));

                password = null;
                m.route.set("/home");
            }
            else {
                err.handle(response);
            }
        })
    },


    // Content is here because the homepage must use session.content
    // to update the ui for all the different layers available
    content: [],
    load_content: (start) => {
        var state = JSON.parse(sessionStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("start", start);
        body.append("num", "100");

        m.request({
            url: "https://www.arcgis.com/sharing/rest/content/users/" + state.username,
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                // Only if this is the first index do we want to reset the
                // content array, otherwise we may be adding content onto the end
                if (response.start == 1) {
                    session.content = [];
                }
                
                // Update session content and state content
                session.content = session.content.concat(response.items);
                state.content = session.content;

                // If there were 100 responses then there may be more responses,
                // because arcgis only returns 100 max layers. Therefore, the call
                // is made again at the proper index
                if (response.num == 100) {
                    session.load_content(response.start + response.num);
                }
                // Otherwise the process is complete and the state can be finally
                // updated to reflect the downloaded content
                else {
                    sessionStorage.setItem("state", JSON.stringify(state));
                }                
            }
            else {
                err.handle(response);
            }
        })
    },

    // Fields is needed for the same reason content is needed,
    // because the ui needs a direct access to the fields of the layer
    // through an array to properly update with mithril
    fields: [],
    load_layer: (index) => {
        // Immediately rest the fields and load in the state
        session.fields = [];
        var state = JSON.parse(sessionStorage.getItem("state"));

        m.request({
            url: state.content[index].url + "/0?f=json&token=" + state.token,
            method: "GET",
        })
        .then((response) => {
            if (response.error == undefined) {
                session.fields = response.fields;
                state.content[index].fields = response.fields;
                sessionStorage.setItem("state", JSON.stringify(state));
            }
            else {
                err.handle(response);
            }
        })
    },

    add: (index, form_input) => {        
        var state = JSON.parse(sessionStorage.getItem("state"));
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

module.exports = session;