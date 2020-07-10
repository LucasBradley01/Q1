var m = require("mithril");
var session = require("../models/session");

module.exports = {
    oninit: () => {session.load_content(1)},
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m("div", "Home"),
                m("div"),
                m("button", {class: "logout", onclick: () => {sessionStorage.setItem("state", "null"); m.route.set("/login");}}, "Logout"),
            ]),

            m("div[class=one-section]", [
                m("button", {onclick: () => {m.route.set("/create")}}, "Create New Layer"),
            ]),

            m("div[class=one-section]", [
                m("div", "Your Layers"),
                m("div", session.content.map((item, index) => {return m(m.route.Link, {class: "item", href: "/update/" + index}, item.name);}))
            ]),
        ]);
    }
}
