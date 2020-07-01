var $ = require("jquery");

var Session = {
    username: "",
    token: "",
    login: function() {
        var settings = {
            "url": "https://www.arcgis.com/sharing/rest/generateToken",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "f": "json",
              "username": this.username,
              "password": this.token,
              "referer": "https://www.arcgis.com",
              "expiration": "60"
            }
          };
          
        $.ajax(settings).done(function (response) {
            var loginResponse = JSON.parse(response);
            if (loginResponse.token) {
                console.log("Successful token creation");
                Session.token = loginResponse.token;
            }
            else {
                console.log("Failed token creation");
                console.log(response);
                console.log(JSON.stringify(settings));
            }
        });
    }
};

module.exports = Session;