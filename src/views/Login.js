var m = require("mithril");
var $ = require("jquery");

var Session = {
    username: "",
    token: ""
}

const login = function() {
    var settings = {
        "url": "https://www.arcgis.com/sharing/rest/generateToken",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
          "f": "json",
          "username": Session.username,
          "password": Session.token,
          "referer": "https://www.arcgis.com",
          "expiration": "60"
        }
      };
      
    $.ajax(settings).done(function (e) {
        var response = JSON.parse(e);
        if (response.token) {
            console.log("Successful token creation");
            Session.token = response.token;
            m.route.set("/home/" + Session.username + "/" + Session.token);
        }
        else {
            console.log("Failed token creation");
            console.log(response);
            console.log(JSON.stringify(settings));
        }
    });
}

module.exports = {
    view: function() {
        return m("form", {
            onsubmit: function() {
                login();
            }
        },
        [
            m("div.labelb", "Username"),
            m("input.input[type=text]", {
                oninput: function(e) {
                    Session.username = e.target.value;
                }
            }),
            m("div.labelb", "Password"),
            m("input.input[type=password]", {
                oninput: function(e) {
                    Session.token = e.target.value;
                }
            }),
            m("br.br"),
            m("button.button[type=submit]", "Login"),
        ])
    }
}