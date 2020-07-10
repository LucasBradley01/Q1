var m = require("mithril");
var login = require("./views/login");
var home = require("./views/home");
var create = require("./views/create");
var update = require("./views/update");
var loading = require("./views/loading");

m.route(document.body, "/login", {
    "/login": login,
    "/home": home,
    "/create": create,
    "/update/:index": update,
    "/loading": loading,
})