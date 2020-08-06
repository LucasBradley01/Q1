var m = require("mithril");


/*
module.exports = {
    view: () => {
        return m("svg", {
                viewBox: "0 0 20 20",
            },
            m("circle", {
                cx: "10px",
                cy: "10px",
                r: "10px",
                fill: "red",
            }),
            m("circle", {
                cx: "10px",
                cy: "10px",
                r: "10px",
                fill: "green",
            },
                m("animate", {
                    attributeName: "r",
                    values: "0;10;0",
                    dur: "5s",
                    repeatCount: "indefinite",
                })
            )
        )
    }
}
*/
/*
module.exports = {
    view: () => {
        return m("svg", {
                width: "1.6em",
                height: "1.6em",
                viewBox: "0 0 20 20",
            },
            
            m("circle", {
                cx: 10,
                cy: 10,
                r: 10,
                fill: "red",
            }),

            m("circle", {
                cx: 10,
                cy: 10,
                r: 8,
                fill: "#ffcccb",
            }),

            m("circle", {
                cx: 10,
                cy: 10,
                r: 6,
                fill: "red",
            }),
            
            m("path", {
                    fill: "red",
                    d: "M 0,10 C 3,3 3,3 10,0 v 20 C 17,17 17,17 20,10 h -20",
                },
                
                m("animateTransform", {
                    attributeType: "xml",
                    attributeName: "transform",
                    type: "rotate",
                    from: "0 10 10",
                    to: "360 10 10",
                    dur: "3s",
                    repeatCount: "indefinite",
                })
                
            )
        )
    }
}*/

module.exports = {
    view: () => {
        return [
            m("circle", {
                id: "l1",
                cx: 4,
                cy: 10,
                r: 2,
            }),
            m("circle", {
                id: "l2",
                cx: 10,
                cy: 10,
                r: 2,
            }),
            m("circle", {
                id: "l3",
                cx: 16,
                cy: 10,
                r: 2,
            }),
        ]
    }
}
