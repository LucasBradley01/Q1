var m = require("mithril");
const worker = require("../workers/create");
var utl = require("../workers/utl");

var createInput = {
    title: undefined,
    fields: [{
        name: undefined,
        data: "string",
    }],
    createResponse: undefined,
}

var dynamic_form = {
    view: () => {
        return [
            m("div", "Field Name"),
            m("div", "Data Type"),
            m("div"),
        ].concat(createInput.fields.map((field, index) => {
            return [
                m("input", {
                    oninput: (e) => {
                        field.name = e.target.value
                    },
                    value: field.name
                }),
                m("select", {
                    oninput: (e) => {
                        field.data = e.target.value
                    },
                    value: field.data
                },
                [
                    m("option[value=esriFieldTypeString]" , "String"),
                    m("option[value=esriFieldTypeInteger]", "Integer"),
                    m("option[value=esriFieldTypeDouble]","Double")
                ]),
                m("button[type=button]", {
                    onclick: () => {
                        createInput.fields.splice(index, 1);
                    }
                }, "Delete")
            ]
        }))
    }
}

module.exports = {
    oninit: () => {
        utl.init()
    },
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m(m.route.Link, {
                    class: "item",
                    href: "/home"
                }, "Home"),
                m("div"),
                m("button[type=button]", {
                    class: "logout",
                    onclick: () => {
                        window.localStorage.removeItem("state");
                        m.route.set("/login");
                    }
                }, "Logout"),
            ]),

            m("div[class=header]", [
                m("div", "Create a New Layer"),
            ]),
            
            m("div[class=three-section]", 
                m("div", "Layer Title"),
                m("input", {
                    oninput: (e) => {
                        createInput.title = e.target.value;
                    },
                    value: createInput.title
                }),
            ),
            
            m("div[class=three-section]", [
                m(dynamic_form),
            ]),

            m("div[class=three-section]", [
                m("button", {
                    onclick: () => {
                        createInput.fields.push({
                            name: "",
                            data: "string"
                        });
                    }
                }, "Add Field"),
                m("button[type=submit]", {
                    onclick: () => {
                        worker.create(createInput)
                    }
                }, "Submit"),
                m("button[type=button]", {
                    onclick: () => {
                        createInput.fields = [{
                            name: undefined,
                            data: "string"
                        }];
                        createInput.title  = "";
                    }
                }, "Clear All"),
            ]),
        ]);
    }
}