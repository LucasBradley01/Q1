var m = require("mithril");

/*
module.exports = {
    view: () => {
        return m("svg", {
                width: "100%",
                height: "100%",
            }, [
            m("defs", [
                m("rect", {
                    id: "myRect",
                    width: "100%",
                    height: "100%",
                }),

                m("linearGradient", {    
                    id: "background",
                    gradientTransform: "rotate(90)",
                },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#1fcecb",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "green",
                    })
                ),
            ]),

            m("use", {
                href: "#myRect",
                fill: "url(#background)",
            })
        ])
    }
}*/

module.exports = {
    view: () => {
        return m("svg", {
                width: "100%",
                height: "100%",
            }, [
            m("defs", [
                m("rect", {
                    id: "myRect",
                    width: "100%",
                    height: "100%",
                }),

                m("linearGradient", {    
                    id: "background",
                    gradientTransform: "rotate(90)",
                },
                    m("stop", {
                        offset: "20%",
                        "stop-color": "#1fcecb",
                    }),
                    m("stop", {
                        offset: "90%",
                        "stop-color": "green",
                    })
                ),
            ]),

            m("use", {
                href: "#myRect",
                fill: "url(#background)",
            }, [
                m("div", "CHECK"),
            ])
        ])
    }
}