var m = require("mithril");
var $ = require("jquery");

var layers = [];

const loadContent = function(username, token, start) {
    var settings = {
        "url": "https://www.arcgis.com/sharing/rest/content/users/" + username,
        "method": "POST",
        "timeout": 0,
        "async": false,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
          "token": token,
          "f": "json",
          "start": start.toString(),
          "num": "100"
        }
      }; 
      
      $.ajax(settings).done(function (response) {
        rJSON = JSON.parse(response);
        if (rJSON.total) {
            console.log("Content loading success");
            for(i = 0; i < rJSON.items.length; i++) {
                layers.push(rJSON.items[i]);
            }
            console.log(rJSON);
        }
        else {
            console.log("Content loading failed");
            console.log(rJSON);
            console.log(settings);
        }
      });
}

module.exports = {
    view: function() {
        return m("div", {oninit: loadContent(m.route.param("username"), m.route.param("token"), 1)}, [
            m("button.button", {onclick: function() {
                m.route.set("/create/" + m.route.param("username") + "/" + m.route.param("token"));
            }}, "Create New Layer"),
            m("div", layers.map(function(layer, index) {
                return [
                    m(m.route.Link, {
                        class: "layer-list-item",
                        href: "/layer/" + m.route.param("username") + "/" + m.route.param("token") + "/" + (index + 1).toString(),
                    }, layer.title),
                    m("br.br")
                ]
            }))
        ])
    }
}