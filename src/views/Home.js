var m = require("mithril");

module.exports = {
    view: function() {
        return m("div", [
            m("button.button", {onclick: function() {
                m.route.set("/create/" + m.route.param("username") + "/" + m.route.param("token"));
            }}, "Create New Layer"),
        ])
    }
}