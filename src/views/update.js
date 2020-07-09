var m = require("mithril");
var session = require("../models/session");

var form_input = {
    longitude: undefined,
    latitude: undefined,
};

module.exports = {
    oninit: () => {session.load_layer(m.route.param("index"))},
    view: () => {
        return ("div", [
            m(m.route.Link, {class: "item", href: "/home"}, "Home"),
            m("button", {class: "logout", onclick: () => {sessionStorage.setItem("state", "null"); m.route.set("/login");}}, "Logout"),
            m("div", JSON.parse(sessionStorage.getItem("state")).content[m.route.param("index")].name),
            
            // Longitude and Latitude are useful for every entry and so
            // are hardcoded to appear
            m("div", [
                m("label", "longitude"),
                m("input", {oninput: (e) => {form_input.longitude = e.target.value;}}),
            ]),
            m("div", [
                m("label", "latitude"),
                m("input", {oninput: (e) => {form_input.latitude = e.target.value;}}),
            ]),
            m("div", session.fields.map((item) => {
                
                // OBJECTID is determined by the ArcGIS server so we don't
                // want or need to input a value for it
                if (item.name == "OBJECTID") {
                    return;
                }

                // This segment will return a label and a input field for each
                // of the layer's fields
                return m("div", [
                    m("label", item.name),
                    m("input", {oninput: (e) => {form_input[item.name] = e.target.value;}}),
                ])})),

            m("button", {onclick: (e) => {session.add(m.route.param("index"), form_input);}}, "Update")
        ]);
    }
}