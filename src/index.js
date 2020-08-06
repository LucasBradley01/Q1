var m = require("mithril");
var login = require("./pages/login");
var home = require("./pages/home");
var create = require("./pages/create");
var update = require("./pages/add");
var test = require("./pages/test");

m.route(document.body, "/login", {
    "/login": login,
    "/home": home,
    "/create": create,
    "/update/:index": update,
    "/test": test,
})