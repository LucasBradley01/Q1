var m = require("mithril");
var model = require("../models/mupdate");
var utl = require("../models/utl");

var formInput = {
    longitude: undefined,
    latitude: undefined,
};

module.exports = {
    oninit: () => {
        utl.init();
        model.load_layer(m.route.param("index"));
    },
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m(m.route.Link, {
                    class: "item",
                    href: "/home"
                }, "Home"),
                m("div"),
                m("button", {
                    class: "logout",
                    onclick: () => {
                        window.localStorage.removeItem("state");
                        m.route.set("/login");
                    }
                }, "Logout"),
            ]),

            m("div[class=header]", [
                m("div", "Add Data to " + (JSON.parse(window.localStorage.getItem("state"))).content[m.route.param("index")].name),
            ]),
            
            // Longitude and Latitude are useful for every entry and so
            // are hardcoded to appear
            m("div[class=three-section]", [
                m("div", "Name"),
                m("div", "Type"),
                m("div", "Input"),                
                m("div", "Longitude"),
                m("div", "Double"),
                m("input", {
                    oninput: (e) => {
                        formInput.longitude = e.target.value;
                    },
                    value: formInput.longitude
                }),
                m("div", "Latitude"),
                m("div", "Double"),
                m("input", {
                    oninput: (e) => {
                        formInput.latitude = e.target.value;
                    },
                    value: formInput.latitude
                }),
            ].concat(model.fields.map((item) => {
                
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
                    m("input", {oninput: (e) => {formInput[item.name] = e.target.value;}, value: formInput[item.name]}),
                ]
            }))),

            m("div[class=three-section]", [
                m("button", {
                    onclick: () => {
                        model.add(m.route.param("index"), formInput);
                    }}, "Update"),
                m("button", {
                    onclick: () => {
                        formInput.longitude = undefined;
                        formInput.latitude = undefined;
                        model.fields.map((item) => {
                            if (item.name != "OBJECTID") {
                                formInput[item.name] = undefined;
                            }
                        })
                    }
                }, "Clear All"),
            ]),
        ]);
    }
}