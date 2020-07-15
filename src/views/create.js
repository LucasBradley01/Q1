var m = require("mithril");
const model = require("../models/mcreate");

var create_input = {
    title: undefined,
    fields: [{
        name: undefined,
        data: "string",
    }],
    create_response: undefined,
}

var dynamic_form = {
    view: () => {
        return [
            m("div", "Field Name"),
            m("div", "Data Type"),
            m("div"),
        ].concat(create_input.fields.map((row, index) => {
            return [
                m("input", {oninput: (e) => row.name = e.target.value, value: row.name}),
                m("select", {oninput: (e) => row.data = e.target.value, value: row.data}, [
                    m("option[value=esriFieldTypeString]" , "String"),
                    m("option[value=esriFieldTypeInteger]", "Integer"),
                    m("option[value=esriFieldTypeDouble]","Double")
                ]),
                m("button[type=button]", {onclick: () => {create_input.fields.splice(index, 1);}}, "Delete")
            ]
        }))
    }
}

module.exports = {
    oninit: () => {model.init()},
    view: () => {
        return m("div[class=root]", [
            m("div[class=three-section]", [
                m(m.route.Link, {class: "item", href: "/home"}, "Home"),
                m("div"),
                m("button[type=button]", {class: "logout", onclick: () => {window.localStorage.removeItem("state"); m.route.set("/login");}}, "Logout"),
            ]),

            m("div[class=header]", [
                m("div", "Create a New Layer"),
            ]),
            
            m("div[class=three-section]", 
                m("div", "Layer Title"),
                m("input", {oninput: (e) => {create_input.title = e.target.value}, value: create_input.title}),
            ),
            
            m("div[class=three-section]", [
                m(dynamic_form),
            ]),

            m("div[class=three-section]", [
                m("button", {onclick: () => {create_input.fields.push({name: "", data: "string"});}}, "Add Field"),
                m("button[type=submit]", {onclick: () => {m.route.set("/loading"); model.create(create_input)}}, "Submit"),
                m("button[type=button]", {onclick: () => {create_input.fields = [{name: undefined, data: "string"}]; create_input.title  = ""}}, "Clear All"),
            ]),
        ]);
    }
}