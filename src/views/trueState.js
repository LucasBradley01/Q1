var m = require("mithril");

module.exports = {
    view: () => {
        return m("svg.gsvg", {
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