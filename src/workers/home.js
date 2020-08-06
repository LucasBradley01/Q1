var m = require("mithril");
var utl = require("./utl");

var home = {
    // Content is here because the homepage must use home.content
    // to update the ui for all the different layers available
    content: [],
    loadContent: (start) => {
        var state = JSON.parse(window.localStorage.getItem("state"));
        
        if (state.content !== null && state.content !== undefined && state.content.length !== 0) {
            home.content = state.content;
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
            if (response.error === undefined) {
                var tempContent = [];

                response.items.map((item) => {
                    tempContent.push({
                        name: item.name,
                        type: item.type,
                        url: item.url,
                    })
                })
                
                // Only if this is the first index do we want to reset the
                // content array, otherwise we may be adding content onto the end
                if (response.start == 1) {
                    home.content = [];
                }
                
                // Update home content and state content
                home.content = home.content.concat(tempContent);
                state.content = home.content;

                // If there were 100 responses then there may be more responses,
                // because arcgis only returns 100 max layers. Therefore, the call
                // is made again at the proper index
                if (response.num == 100) {
                    home.loadContent(response.start + response.num);
                }
                // Otherwise the process is complete and the state can be finally
                // updated to reflect the downloaded content
                else {
                    window.localStorage.setItem("state", JSON.stringify(state));
                }                
            }
            else {
                utl.handle(response);
            }
        })
    },

    load: (index) => {
        var state = JSON.parse(localStorage.getItem("state"));

        m.request({
            url: state.content[index].url + "/0?f=json&token=" + state.token,
            method: "GET",
        })
        .then((response) => {
            if (response.error == undefined) {
                state.fields[index] = response.fields;
                state.loading[index] = false;
                localStorage.setItem("state", JSON.stringify(state));
            }
            else {
                state.loading[index] = false;
                localStorage.setItem("state", JSON.stringify(state));
                utl.handle(response);
            }
        })
    },
    
    sync: (index) => {
        var state = JSON.parse(localStorage.getItem("state"));
        
        if (state.pending[index] === null || state.pending[index] === undefined || state.pending[index].length < 0) {
            state.syncing[index] = false;
            localStorage.setItem("state", JSON.stringify(state));
            return;
        }
        
        


    },
}

module.exports = home;