var m = require("mithril");
var model = require("../models/mhome");
var utl = require("../models/utl");

var loadingState = require("./loadingState.js");
var falseState = require("./falseState.js");
var trueState = require("./trueState.js")

var layerTable = {
    view: () => {
        return [
            m("div", "Layers"),
            m("div", "Loaded"),
            m("div", "Updated"),
        ].concat(model.content.map((item, index) => {
            var state = JSON.parse(window.localStorage.getItem("state"));
            var itemName = item.name;

            if (state.fields !== null && state.fields !== undefined && state.fields[itemName]) {
                loadState = trueState;
            }
            else if (false){
                loadState = loadingState;
            }
            else {
                loadState = falseState;
            }

            if (state.pending !== null && state.pending !== undefined && state.pending[itemName]) {
                updateState = falseState;
            }
            else if (false){
                loadState = loadingState;
            }
            else {
                updateState = trueState;
            }

            return [
                m(m.route.Link, {
                    class: "item",
                    href: "/update/" + index
                }, item.name),
                m(loadState),
                m(updateState),
            ]
        }))
    }
}

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
                m(layerTable),
            ]),
        ]);
    }
}

/*
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
                    var loaded = "r";

                    if (state.fields !== null && state.fields !== undefined && state.fields[itemName]) {
                        loaded = "g";
                    }

                    return m("svg." + loaded + "svg", {
                            onclick: () => {
                                // ACTION
                                console.log("Load");
                            }
                        },
                        m("circle", {
                            cx: 10,
                            cy: 20,
                            r: 10,
                        })
                    );
                })),

                // Updated
                m("div", model.content.map((item, index) => {
                    var state = JSON.parse(window.localStorage.getItem("state"));
                    var itemName = state.content[index].name;
                    var pending = "g";

                    if (state.pending !== null && state.pending !== undefined && state.pending[itemName]) {
                        pending = "r";
                    }

                    return m(loading);

                    return m("svg." + pending + "svg", {
                            onclick: () => {
                                // ACTION
                                console.log("Update");
                            }
                        },
                        m("circle", {
                            cx: 10,
                            cy: 20,
                            r: 10,
                        })
                    );
                })),
*/
