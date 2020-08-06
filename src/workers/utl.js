var m = require("mithril");

var utl = {
    handle: (response) => {
        if (response.error.code == 403 || response.error.code == 498) {
            m.route.set("/login");
            alert("Error: " + response.error.message);
        }
        else {
            console.log("ERROR: failed to add fields");
            console.log(response);
            alert("Error: " + response.error.message);
        }
    },

    init: () => {
        var rawState = window.localStorage.getItem("state");
        if (rawState === null) {
            m.route.set("/login");
            return;
        }

        var state = JSON.parse(rawState);
        var currentTime = new Date();
        if (state.expires === null || state.expires < currentTime.getTime()) {
            m.route.set("/login");
            return;
        }
    },
}

module.exports = utl;