var m = require("mithril");
var session = require("../models/session");

module.exports = {
    oninit: () => {session.load_content(1)},
    view: () => {
        return m("div", [
            m("div", "Home"),
            m("button", {class: "logout", onclick: () => {sessionStorage.setItem("state", "null"); m.route.set("/login");}}, "Logout"),
            m("button", {onclick: () => {m.route.set("/create")}}, "New Layer"),
            m("div", session.content.map((item, index) => {return m(m.route.Link, {class: "item", href: "/update/" + index}, item.name);}))
        ]);
    }
}
