var m = require("mithril");

module.exports = {
    view: () => {
        return m("div[id=loading]", [
            m("div", "This will take a moment."),
            m("div", "Please stay on this page."),
            m("div", "Loading..."),
        ]);
    }
}