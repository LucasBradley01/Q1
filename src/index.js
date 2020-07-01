var m = require("mithril");
var Login = require("./views/Login");
var Home = require("./views/Home");
var Create = require("./views/Create")

m.route(document.body, "/login", {
    "/login": Login,
    "/home/:username/:token": Home,
    "/create/:username/:token": Create
})