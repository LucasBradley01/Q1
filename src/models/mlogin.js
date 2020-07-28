var m = require("mithril");
var utl = require("./utl");

var mlogin = {
    // Init organizes the data to be used by this session
    init: () => {
        var rawState = window.localStorage.getItem("state");

        if (rawState === null) {
            var str = JSON.stringify({
                username: null,
                token: null,
                expires: null,
                content: [],
                fields: {},
                pending: {},
            })
    
            window.localStorage.setItem("state", str);
        }
        else {
            var state = JSON.parse(window.localStorage.getItem("state"));
            currentTime = new Date();
            if (state.expires > currentTime.getTime()) {
                m.route.set("/home");
            }
        }
    },

    // Login is tasked with generating a token for the session
    login: (username, password) => {
        // The body of the request is arranged here
        var body = new FormData();
        // Determine return format
        body.append("f", "json");
        body.append("username", username);
        body.append("password", password);
        body.append("referer", "https://quinquereme.z13.web.core.windows.net");
        // How long a token will be valid in minutes
        body.append("expiration", "480");
        
        // XML call to generate a token from arcgis
        return m.request({
            url: "https://www.arcgis.com/sharing/rest/generateToken",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.token) {
                var state = JSON.parse(window.localStorage.getItem("state"));
                state.username = username;
                state.token = response.token;
                state.expires = response.expires;
                var str = JSON.stringify(state)

                window.localStorage.setItem("state", str);

                password = null;
                m.route.set("/home");
            }
            else {
                utl.handle(response);
            }
        })
    }
}

module.exports = mlogin;