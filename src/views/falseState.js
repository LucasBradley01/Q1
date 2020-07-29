var m = require("mithril");

module.exports = {
    view: () => {
        return m("svg.rsvg", {
                onclick: () => {
                    // ACTION
                    console.log("Update");
                },
                viewBox: "0 0 20 20",
            },
            m("circle", {
                cx: 10,
                cy: 10,
                r: 10,
            })
        );
    }
}