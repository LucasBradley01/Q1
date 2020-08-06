let m = require("mithril");
let worker = require("../workers/home");
let utl = require("../workers/utl");
var background = require("../svgs/background");

let loadingOrbs = require("../svgs/loadingOrbs.js");
let greenOrb = require("../svgs/greenOrb.js")
let redOrb = require("../svgs/redOrb.js")

let layerTable = {
    view: () => {
        return [
            m("div", "Layers"),
            m("div", "Loaded"),
            m("div", "Synced"),
            m("div"),
        ].concat(worker.content.map((item, index) => {
            let state = JSON.parse(localStorage.getItem("state"));

            let tempLoadOrb;
            let svgLoadClass;
            let loadOrb;
            if (state.fields[index] !== undefined && state.fields[index] !== null) {
                tempLoadOrb = greenOrb;
                svgLoadClass = "gsvg";
            }
            else {
                tempLoadOrb = redOrb;
                svgLoadClass = "rsvg";
            }

            if (state.loading[index] !== undefined && state.loading[index]){
                loadOrb = {
                    view: () => {
                        return m("svg", {
                                class: svgLoadClass,
                                viewBox: "0 0 20 20",
                            },
                            m(tempLoadOrb),
                            m(loadingOrbs),
                        )
                    }
                };
            }
            else {
                loadOrb = {
                    view: () => {
                        return m("svg", {
                                class: svgLoadClass,
                                onclick: () => {
                                    let state = JSON.parse(localStorage.getItem("state"));
                                    state.loading[index] = true;
                                    localStorage.setItem("state", JSON.stringify(state));
                                    worker.load(index);
                                },
                                viewBox: "0 0 20 20",
                            },
                            m(tempLoadOrb),
                        )
                    }
                };
            }

            let tempSyncOrb;
            let svgSyncClass;
            let syncOrb;
            if (state.pending[index] !== undefined && state.pending[index] != null) {
                tempSyncOrb = redOrb;
                svgSyncClass = "rsvg";
            }
            else {
                tempSyncOrb = greenOrb;
                svgSyncClass = "gsvg";
            }

            if (state.syncing[index] !== undefined && state.syncing[index]){
                syncOrb = {
                    view: () => {
                        return m("svg", {
                                class: svgSyncClass,
                                viewBox: "0 0 20 20",
                            },
                            m(tempSyncOrb),
                            m(loadingOrbs),
                        )
                    }
                };
            }
            else {
                syncOrb = {
                    view: () => {
                        return m("svg", {
                                class: svgSyncClass,
                                onclick: () => {
                                    let state = JSON.parse(localStorage.getItem("state"));
                                    state.syncing[index] = true;
                                    localStorage.setItem("state", JSON.stringify(state));
                                    worker.sync(index);
                                },
                                viewBox: "0 0 20 20",
                            },
                            m(tempSyncOrb),
                        )
                    }
                };
            }

            return [
                m(m.route.Link, {
                    class: "item",
                    href: "/update/" + index
                }, item.name),
                m(loadOrb),
                m(syncOrb),
                m("div"),
            ]
        }))
    }
}

module.exports = {
    oninit: () => {
        utl.init()
        worker.loadContent(1);
    },
    view: () => {
        return m("div[class=root]", [
            m("div[id=display-table]", [
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
                }, "Sync"),
                m("button", {
                    class: "logout",
                    onclick: () => {
                        localStorage.removeItem("state");
                        m.route.set("/login");
                    }
                }, "Logout"),
                m("div"),
                m(layerTable),
            ]),
        ]);
    }
}
