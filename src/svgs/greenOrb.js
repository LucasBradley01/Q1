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
                        id: "trueGradient",
                        gradientTransform: "rotate(90)",
                    },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#008000",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "#00FF00",
                    })
                ),
    
                m("linearGradient", {    
                        id: "hoverTrueGradient",
                        gradientTransform: "rotate(90)",
                    },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#003300",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "#008000",
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