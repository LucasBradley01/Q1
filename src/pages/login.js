var m = require("mithril");
var worker = require("../workers/login");

var username = "";
var password = "";

module.exports = {
    oninit: () => {
        worker.init()
    },
    view: () => {
        return m("div", {
                id: "login",
            }, [
                m("div", {
                    id: "login-section"
                }, [
                    m("div", {
                        class: "item",
                    }, "Username"),
    
                    m("input", {
                        class: "item",
                        oninput: (e) => {
                            username = e.target.value
                        }
                    }),
    
                    m("div", {
                        class: "item",
                    }, "Password"),
    
                    m("input", {
                            type: "password",
                            class: "item",
                            oninput: (e) => {
                                password = e.target.value
                            }
                        }
                    ),
                    
                    m("button", {
                        class: "item",
                        onclick: () => {
                            worker.login(username, password);
                        }
                    }, "Login")
                ]
            )
        ]);
    }
}