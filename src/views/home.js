var m = require("mithril");
var model = require("../models/mhome");

module.exports = {
    oninit: () => {model.init(1)},
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m("div", "Home"),
                m("div"),
                m("button", {class: "logout", onclick: () => {window.localStorage.removeItem("state"); m.route.set("/login");}}, "Logout"),
            ]),

            m("div[class=one-section]", [
                m("button", {onclick: () => {m.route.set("/create")}}, "Create New Layer"),
            ]),

            m("div[class=one-section]", [
                m("div", "Your Layers"),
                m("div", model.content.map((item, index) => {return m(m.route.Link, {class: "item", href: "/update/" + index}, item.name);}))
            ]),
        ]);
    }
}
