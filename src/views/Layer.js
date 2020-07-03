var m = require("mithril");
var $ = require("jquery");

var fields = []

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
          "num": "1"
        }
      }; 
      
      $.ajax(settings).done(function (response) {
        rJSON = JSON.parse(response);
        if (rJSON.total) {
            console.log("Content loading success");
            loadLayer(token, rJSON.items[0].name)
        }
        else {
            console.log("Content loading failed");
            console.log(rJSON);
            console.log(settings);
        }
      });
}

var loadLayer = function(token, title) {
    var settings = {
        "url": "https://services2.arcgis.com/CmZSzQnVHp24tKCa/ArcGIS/rest/services/" + title + "/FeatureServer/0?f=json&token=" + token, 
        //"url": url + "?f=json&token=" + token,
        "method": "GET",
        "timeout": 0,
        "async": false
    };
      
    $.ajax(settings).done(function (response) {
        rJSON = JSON.parse(response);
        if(rJSON.fields) {
            console.log("Layer loading success");
            for(i = 0; i < rJSON.fields.length; i++) {
                fields.push(rJSON.fields[i]);
                fields.data = "";
            }
        } 
        else {
            console.log("Layer loading failed");
            console.log(rJSON);
            console.log(settings);
        }
    });
}

var edit = function(token) {
    
    var settings = {
        "url": "https://services2.arcgis.com/CmZSzQnVHp24tKCa/arcgis/rest/services/demo2/FeatureServer/0/applyEdits",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
          "f": "json",
          "token": token,
          "adds": JSON.stringify({
              "geometry": {
                  "x": -143,
                  "y": 50
              },
              "attributes": {
                  "MSTR": fields[1].data,
                  "MINT": fields[2].data,
                  "MOUB": fields[3].data,
              }
          })
        }
      };
      
      $.ajax(settings).done(function (response) {
        var rJSON = JSON.parse(response);
        if (!rJSON.error) {
            console.log("Layer successfully updated");

        }
        else {
            console.log("Failed to update layer");
            console.log(rJSON);
            console.log(settings);
        }
      });
}

module.exports = {
    view: function() {
        return m("div", [
            m("button.button[type=button]", {onclick: () => {
                loadContent(m.route.param("username"), m.route.param("token"), m.route.param("id"));
            }}, "Button"),
            m("div", fields.map(function(field) {
                return [
                    m("label", field.name),
                    m("input.input", {oninput: (e) => field.data = e.target.value}),
                    m("br.br"), 
                ]
            })),
            m("button.button[type=button]", {onclick: () => {
                edit(m.route.param("token"));
            }}, "Button")
        ])
    }
}