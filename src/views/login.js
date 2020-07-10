var m = require("mithril");
var session = require("../models/session");

var username = "";
var password = "";

module.exports = {
    oninit: () => {session.init()},
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m("div"),
                m("div", "Username"),
                m("div"),

                m("div"),
                m("input", {oninput: (e) => {username = e.target.value}}),
                m("div"),

                m("div"),
                m("div", "Password"),
                m("div"),

                m("div"),
                m("input[type=password]", {oninput: (e) => {password = e.target.value}}),
                m("div"),
                
                m("div"),
                m("button", {onclick: () => {session.login(username, password);}}, "Login")
            ])
        ]);
    }
}