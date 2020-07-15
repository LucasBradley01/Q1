var m = require("mithril");
var err = require("./error");

var mhome = {
    // Content is here because the homepage must use mhome.content
    // to update the ui for all the different layers available
    content: [],
    init: (start) => {
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
        
        if (state.content != null) {
            mhome.content = state.content;
        }

        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("start", start);
        body.append("num", "100");

        m.request({
            url: "https://www.arcgis.com/sharing/rest/content/users/" + state.username,
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                // Only if this is the first index do we want to reset the
                // content array, otherwise we may be adding content onto the end
                if (response.start == 1) {
                    mhome.content = [];
                }
                
                // Update mhome content and state content
                mhome.content = mhome.content.concat(response.items);
                state.content = mhome.content;

                // If there were 100 responses then there may be more responses,
                // because arcgis only returns 100 max layers. Therefore, the call
                // is made again at the proper index
                if (response.num == 100) {
                    mhome.load_content(response.start + response.num);
                }
                // Otherwise the process is complete and the state can be finally
                // updated to reflect the downloaded content
                else {
                    var str = JSON.stringify(state)
                    window.localStorage.setItem("state", str);
                }                
            }
            else {
                //err.handle(response);
                console.log(response);
            }
        })
    },
}

module.exports = mhome;