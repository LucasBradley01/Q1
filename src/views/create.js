var m = require("mithril");
const new_layer = require("../models/new_layer");

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
            m("div", 
                m("label", "Name"),
                m("button", {onclick: () => {create_input.fields.push({name: "", data: "string"});}}, "Add Field"),
            ),
        ].concat(create_input.fields.map((row, index) => m('div', 
            m("input", {oninput: (e) => row.name = e.target.value, value: row.name}),
            m("select", {oninput: (e) => row.data = e.target.value, value: row.data}, [
                m("option[value=esriFieldTypeString]" , "String"),
                m("option[value=esriFieldTypeInteger]", "Integer"),
                m("option[value=esriFieldTypeDouble]","Double")
            ]),
            m("button.button", {onclick: () => {create_input.fields.splice(index, 1);}}, "Delete")
        )))
    }
}

module.exports = {
    view: () => {
        return ("div", [
            m(m.route.Link, {class: "item", href: "/home"}, "Home"),
            m("button", {class: "logout", onclick: () => {sessionStorage.setItem("state", "null"); m.route.set("/login");}}, "Logout"),
            m("div", "New Layer"),
            m("div", 
                m("label", "title"),
                m("input", {oninput: (e) => {create_input.title = e.target.value}}),
            ),
            m(dynamic_form),
            m("button", {onclick: () => {new_layer.create(create_input)}}, "Submit"),
        ]);
    }
}