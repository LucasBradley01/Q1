var m = require("mithril");
var session = require("../models/session");

var form_input = {
    longitude: undefined,
    latitude: undefined,
};

module.exports = {
    oninit: () => {session.load_layer(m.route.param("index"))},
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m(m.route.Link, {class: "item", href: "/home"}, "Home"),
                m("div"),
                m("button", {class: "logout", onclick: () => {sessionStorage.setItem("state", "null"); m.route.set("/login");}}, "Logout"),
            ]),

            m("div[class=header]", [
                m("div", "Add Data to " + JSON.parse(sessionStorage.getItem("state")).content[m.route.param("index")].name),
            ]),
            
            // Longitude and Latitude are useful for every entry and so
            // are hardcoded to appear
            m("div[class=three-section]", [
                m("div", "Field Name"),
                m("div", "Data Type"),
                m("div", "Input"),                
                m("div", "Longitude"),
                m("div", "Double"),
                m("input", {oninput: (e) => {form_input.longitude = e.target.value;}, value: form_input.longitude}),
                m("div", "Latitude"),
                m("div", "Double"),
                m("input", {oninput: (e) => {form_input.latitude = e.target.value;}, value: form_input.latitude}),
            ].concat(session.fields.map((item) => {
                
                // OBJECTID is determined by the ArcGIS server so we don't
                // want or need to input a value for it
                if (item.name == "OBJECTID") {
                    return;
                }

                var type = undefined;
                switch(item.type) {
                    case "esriFieldTypeString":
                        type = "String";
                        break;
                    case "esriFieldTypeInteger":
                        type = "Integer";
                        break;
                    case "esriFieldTypeDouble":
                        type = "Double";
                }

                // This segment will return a label and a input field for each
                // of the layer's fields
                return [
                    m("div", item.name),
                    m("div", type),
                    m("input", {oninput: (e) => {form_input[item.name] = e.target.value;}, value: form_input[item.name]}),
                ]
            }))),

            m("div[class=three-section]", [
                m("button", {onclick: () => {session.add(m.route.param("index"), form_input);}}, "Update"),
                m("button", {onclick: () => {
                    form_input.longitude = undefined;
                    form_input.latitude = undefined;
                    session.fields.map((item) => {
                        if (item.name != "OBJECTID") {
                            form_input[item.name] = undefined;
                        }
                    })
                }}, "Clear All"),
            ]),
        ]);
    }
}