var m = require("mithril");
var session = require("../models/session");

var username = "";
var password = "";

module.exports = {
    oninit: () => {session.init()},
    view: () => {
        return m("div", [
            m("div", "Username"),
            m("input", {oninput: (e) => {username = e.target.value}}),
            m("div", "Password"),
            m("input[type=password]", {oninput: (e) => {password = e.target.value}}),
            m("button", {onclick: () => {session.login(username, password);}}, "Login")
        ])
    }
}