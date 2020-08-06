var m = require("mithril");

module.exports = {
    view: () => {
        return [
            m("defs", [
                m("circle", {
                    id: "myCircle",
                    cx: 0,
                    cy: 0,
                    r: 10,
                }),
    
                m("linearGradient", {    
                        id: "falseGradient",
                        gradientTransform: "rotate(90)",
                    },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#ff0000",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "#ff9999",
                    })
                ),
    
                m("linearGradient", {    
                        id: "hoverFalseGradient",
                        gradientTransform: "rotate(90)",
                    },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#660000",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "#ff0000",
                    })
                ),
            ]),
    
            m("use", {
                x: 10,
                y: 10,
                href: "#myCircle",
            })
        ]
    }
}