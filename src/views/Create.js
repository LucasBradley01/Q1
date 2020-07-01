var m = require("mithril");
var $ = require("jquery");
var counter = 0;

var form = {
    username: "",
    token: "",
    createResponse: {},
    title: "",
    tags: "",
    type: "",
    fields: []
}

/*
Create service is tasked with sending a REST call to arcgis telling
it to create a new feature service on the proper account. This feature
service must then be further defined in other REST api calls, without
those further api calls the new feature layer is invalid
*/
const createService = function() {
    // The settings for the REST api call are long and complex, documentation for this REST call can 
    // be found at https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm
    // the documentation is not that good fromt the link however, and the way that I personally
    // created this format was by using browser development tools and postman to reconstruct the
    // calls used by ArcGIS themselves to create the feature service. The same applies for all the
    // other REST api calls in this javascript file
    var createServiceSettings = {
        "url": "https://www.arcgis.com/sharing/rest/content/users/" + form.username + "/createService",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "token": form.token,
            "typeKeywords": "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service",
            "outputType": "featureService",
            // NOTE: that create parameters must be a string, it does not work if a JSON object is put
            // as its value. If it is not a string, then the api call will not work.
            "createParameters": JSON.stringify({
                "maxRecordCount": 2000,
                "supportedQueryFormats": "JSON",
                "capabilities": "Query",
                "description": "",
                "allowGeometryUpdates": true,
                "hasStaticData": true,
                "units": "esriMeters",
                "syncEnabled": false,
                "editorTrackingInfo": {
                    "enableEditorTracking": false,
                    "enableOwnershipAccessControl": false,
                    "allowOthersToQuery": true,
                    "allowOthersToUpdate": true,
                    "allowOthersToDelete": false,
                    "allowAnonymousToUpdate": true,
                    "allowAnonymousToDelete": true
                },
                "xssPreventionInfo": {
                    "xssPreventionEnabled": true,
                    "xssPreventionRule": "InputOnly",
                    "xssInputRule": "rejectInvalid"
                },
                "initialExtent": {
                    "xmin": -161.69675114151386,
                    "ymin": -72.6726762942099,
                    "xmax": 161.69675114151386,
                    "ymax": 80.69452318405212,
                    "spatialReference": {
                        "wkid": 4326
                    }
                },
                "spatialReference": {
                    "wkid": 4326
                },
                "tables": [],
                "name": form.title
            }),
            "tags": form.tags,
            "f": "json"
        }
    };
    
    // JQuery and ajax are responsible for dispatching the predefinied settings
    $.ajax(createServiceSettings).done(function (response) {
        form.createResponse = JSON.parse(response);
        if (form.createResponse.success) {
            console.log("Successful service creation");
            addToDefinition(form);
        }
        else {
            console.log("Failed service creation");
            console.log(response);
            console.log(JSON.stringify(form));
        }
    });
}

/*
Add to definition is vital for the feature service. Without this call
the feature service created in the previous REST call is totally useless.
This call gives the feature service the fields it needs to be used at all.
*/
const addToDefinition = function(form) {
    // THE URL IS CREATED WITH THE ASSUMPTION THAT IT WILL BE SEPARATED ON EXACTLY 58
    // IT IS POSSIBLE THIS ISN'T THE CASE AND THEREFORE THIS MUST BE MADE TO BE MORE
    // ELASTIC, AS IT IS IT MAY EASILY BREAK
    var baseUrl = form.createResponse.serviceurl + "/addToDefinition";
    var addToDefinitionUrl = baseUrl.slice(0, 58) + "admin/" + baseUrl.slice(58);

    // Note that the reason that the addToDefinition value is not
    // done inline of the main JSON object is because the fields must
    // be added to it before it is operational.
    var addToDefinitionParameters = {
        "layers": [
            {
                "adminLayerInfo":
                {
                    "geometryField": {
                        "name": "Shape",
                        "srid":4326
                    }
                },
                "name": form.title,
                "type": "Feature Layer",
                "displayField": "",
                "description": "",
                "copyrightText": "",
                "defaultVisibility": true,
                "relationships": [],
                "isDataVersioned": false,
                "supportsRollbackOnFailureParameter": true,
                "supportsAdvancedQueries": true,
                "geometryType": "esriGeometryPoint",
                "minScale": 0,
                "maxScale": 0,
                "extent": {
                    "xmin": -161.69675114151386,
                    "ymin": -72.6726762942099,
                    "xmax": 161.69675114151386,
                    "ymax": 80.69452318405212,
                    "spatialReference": {
                        "wkid":4326
                    }
                },
                "drawingInfo": {
                    "transparency": 0,
                    "labelingInfo": null,
                    "renderer": {
                        "type": "simple",
                        "symbol": {
                            "color": [20,158,206,130],
                            "size": 18,
                            "angle": 0,
                            "xoffset": 0,
                            "yoffset": 0,
                            "type": "esriSMS",
                            "style": "esriSMSCircle",
                            "outline": {
                                "color": [255,255,255,220],
                                "width": 2.25,
                                "type": "esriSLS",
                                "style": "esriSLSSolid"
                            }
                        }
                    }
                },
                "allowGeometryUpdates": true,
                "hasAttachments": true,
                "htmlPopupType": "esriServerHTMLPopupTypeNone",
                "hasM": false,
                "hasZ": false,
                "objectIdField": "OBJECTID",
                "globalIdField": "",
                "typeIdField": "",
                "fields": [
                    {
                        "name": "OBJECTID",
                        "type": "esriFieldTypeOID",
                        "alias": "OBJECTID",
                        "sqlType": "sqlTypeOther",
                        "nullable": false,
                        "editable": false,
                        "domain": null,
                        "defaultValue":null
                    },
                ],
                "indexes": [],
                "types": [],
                "templates": [
                    {
                        "name": "New Feature",
                        "description": "",
                        "drawingTool": "esriFeatureEditToolPoint",
                        "prototype": {
                            "attributes": {
                                // NO PROTOTYPE THE PREVIOUS VALUES HERE
                                // FROM THE TEST I DID WERE
                                //"f1": null
                                //"f2": null
                                //"f3": null
                                // THIS WAS WITH THREE FIELDS AND THOSE
                                // WERE THERE NAMES
                            }
                        }
                    }
                ],
                "supportedQueryFormats": "JSON",
                "hasStaticData": true,
                "maxRecordCount": 10000,
                "capabilities": "Query"
            }
        ]
    };

    // Here the particular fields are created and added to addToDefinitionParameters
    var squlType = "";
    var length = null;
    for (i = 0; i < form.fields.length; i++) {        
        length = null;
        switch(form.fields[i].type) {
            case "String":
                squlType = "sqlTypeNVarchar";
                length = 256;
                break;
            case "Integer":
                squlType = "sqlTypeInteger";
                break;
            default:
                squlType = "sqlTypeFloat";
        }
        
        // This is the form of a field parameter as derived from
        // checking browser dev tools
        addToDefinitionParameters.layers[0].fields.push({
            "name": form.fields[i].name,
            "type": "esriFieldType" + form.fields[i].data,
            "alias": form.fields[i].alias,
            "sqlType": squlType,
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null,
            "length": length
        });
    }

    // Now that the addToDefinitionParameters have been defined the
    // settings for the REST api call dispatch using JQuery and ajax
    // can be made

    // The settings for the REST api call are long and complex, documentation for this REST call can 
    // be found at https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm
    // the documentation is not that good fromt the link however, and the way that I personally
    // created this format was by using browser development tools and postman to reconstruct the
    // calls used by ArcGIS themselves to create the feature service. The same applies for all the
    // other REST api calls in this javascript file
    var addToDefinitionSettings = {
        "url": addToDefinitionUrl,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "token": form.token,
            // NOTE: addToDefinitionParameters must be a string
            "addToDefinition": JSON.stringify(addToDefinitionParameters),
            "f": "json"
        }
    };

    // WHEN THIS FAILS IT MAY BE NECESSARY TO DELETE THE PREVIOUSLY CREATED
    // FEATURE SERVICE, IT ISN'T GOOD TO HAVE A EMPTY FEATURE SERVICE WHICH
    // IS UNUSABLE AND THE USER MUST DELETE THEMSELVES
    $.ajax(addToDefinitionSettings).done(function (response) {
        var addToDefinitionResponseJSON = JSON.parse(response);
        if (addToDefinitionResponseJSON.success) {
            console.log("Successful add to definition");
            updateDefinition(form);
        }
        else {
            console.log("Failed add to definition");
            console.log(response);
            console.log(JSON.stringify(form));
        }
    });
}

/*
This feature call is used to do the final defining of the feature service
already created and edited in the previous api calls.
*/
// THIS API CALL MAY BE UNNECCESSARY MUCH OF IT IS ALREADY IN CREATE SERVICE
const updateDefinition = function(form) {
    // THE URL IS CREATED WITH THE ASSUMPTION THAT IT WILL BE SEPARATED ON EXACTLY 58
    // IT IS POSSIBLE THIS ISN'T THE CASE AND THEREFORE THIS MUST BE MADE TO BE MORE
    // ELASTIC, AS IT IS IT MAY EASILY BREAK
    var baseUrl = form.createResponse.serviceurl + "/updateDefinition";
    var updateDefinitionUrl = baseUrl.slice(0, 58) + "admin/" + baseUrl.slice(58);

    // The settings for the REST api call are long and complex, documentation for this REST call can 
    // be found at https://developers.arcgis.com/rest/services-reference/update-definition-feature-service-.htm
    // the documentation is not that good fromt the link however, and the way that I personally
    // created this format was by using browser development tools and postman to reconstruct the
    // calls used by ArcGIS themselves to create the feature service. The same applies for all the
    // other REST api calls in this javascript file
    var settings = {
        "url": updateDefinitionUrl,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
            "token": form.token,
            "updateDefinition": JSON.stringify({
                "hasStaticData": false,
                "capabilities": "Query,Editing,Create,Update,Delete,Extract",
                "allowGeometryUpdates": true,
                "editorTrackingInfo": {
                    "enableEditorTracking": false,
                    "enableOwnershipAccessControl": false,
                    "allowOthersToUpdate": true,
                    "allowOthersToDelete": true,
                    "allowOthersToQuery": true,
                    "allowAnonymousToUpdate": true,
                    "allowAnonymousToDelete":true
                }
            }),
            "f": "json"
        }

    };
    
    // IF THIS CALL FAILS MAYBE SOMETHING MORE SHOULD BE DONE
    $.ajax(settings).done(function (response) {
        var updateDefinitionResponseJSON = JSON.parse(response);
        if (updateDefinitionResponseJSON.success) {
            console.log("Successful update to defintion");
        }
        else {
            console.log("Failed update to defintion");
            console.log(response);
            console.log(JSON.stringify(form));
        }
    });
}

var dynamicForm = {
    view: function() {
        return [
            m("div.label", "Fields"),
            m("br.br"),
            m("button.button[type=button]", {onclick: function() {
                form.fields.push({name:"", alias:"", data:"string"});
            }}, "Add Field"),
            m("br.br"),
            m("div.label", "Name"),
            m("div.label", "Alias"),
            m("div.label", "Data"),
            m("br.br")
        ].concat(form.fields.map((row, index) => m('div', 
            m("input.input", {oninput: (e) => row.name = e.target.value, value: row.name}),
            m("input.input", {oninput: (e) => row.alias = e.target.value, value: row.alias}),
            m("select.input", {oninput: (e) => row.data = e.target.value, value: row.data}, [
                m("option[value=string]" , "String"),
                m("option[value=integer]", "Integer"),
                m("option[value=double]","Double")
            ]),
            m("button.button[type=button]", {onclick: () => {
                form.fields.splice(index, 1);
            }}, "Delete")
        )));
  }
};

form.type = "points";
module.exports = {
    view: function() {
        return m("form", {onsubmit: function(e) {
                form.username = m.route.param("username");
                form.token = m.route.param("token");
                console.log(form);
                createService();
            }}, [
            m("div.label", "Title"),
            m("div.label", "Tags"),
            m("div.label", "Type"),
            m("br.br"),
            m("input.input[type=text]", {oninput: function(e) {form.title = e.target.value;}}),
            m("input.input[type=text]", {oninput: function(e) {form.tags = e.target.value;}}),
            m("select.input", {oninput: function(e) {form.tags = e.target.value;}}, [
                m("option[value=points]", "Points"),
                m("option[value=lines]", "Lines"),
                m("option[value=polygons]", "Polygons")
            ]),
            m("br.br"),
            m(dynamicForm),
            m("button.button[type=submit]", "Submit"),
        ])
    }
}