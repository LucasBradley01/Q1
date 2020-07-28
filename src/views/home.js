var m = require("mithril");
var model = require("../models/mhome");
var utl = require("../models/utl");

module.exports = {
    oninit: () => {
        utl.init()
        model.load_content(1);
    },
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                // Grid row 1
                m("button", {
                    onclick: () => {
                        m.route.set("/create");
                    }
                }, "New"),
                m("button", {
                    onclick: () => {
                        // TODO push updates button
                    }
                }, "Update"),
                m("button", {
                    class: "logout",
                    onclick: () => {
                        window.localStorage.removeItem("state");
                        m.route.set("/login");
                    }
                }, "Logout"),

                // Grid row 2
                m("div", "Layers"),
                m("div", "Loaded"),
                m("div", "Updated"),
                
                // Grid row 3
                // Your Layers
                m("div", model.content.map((item, index) => {
                    return m(m.route.Link, {
                        class: "item",
                        href: "/update/" + index
                    }, item.name);
                })),

                // Loaded
                m("div", model.content.map((item, index) => {
                    var state = JSON.parse(window.localStorage.getItem("state"));
                    var itemName = state.content[index].name;
                    var loaded = "red";

                    if (state.fields !== null && state.fields !== undefined && state.fields[itemName]) {
                        loaded = "green";
                    }

                    return m("svg.icon",
                        m("circle", {
                            cx: 10,
                            cy: 10,
                            r: 10,
                            fill: loaded
                        })
                    );
                })),

                // Updated
                m("div", model.content.map((item, index) => {
                    var state = JSON.parse(window.localStorage.getItem("state"));
                    var itemName = state.content[index].name;
                    var pending = "green";

                    if (state.pending !== null && state.pending !== undefined && state.pending[itemName]) {
                        pending = "red";
                    }

                    return m("svg.icon",
                        m("circle", {
                            cx: 10,
                            cy: 10,
                            r: 10,
                            fill: pending
                        })
                    );
                })),
            ]),
        ]);
    }
}
