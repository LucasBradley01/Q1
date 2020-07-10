var m = require("mithril");

var new_layer = {
    create: (create_input) => {
        state = JSON.parse(sessionStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("tags", "");
        body.append("typeKeywords", "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service");
        body.append("outputType", "featureService");
        body.append("createParameters", JSON.stringify({
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
            "name": create_input.title
        }))

        m.request({
            url: "https://www.arcgis.com/sharing/rest/content/users/" + state.username + "/createService",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                create_input.create_response = response;
                new_layer.add_fields(create_input);
            }
            else {
                if (response.error.code == 403) {
                    m.route.set("/login");
                }
                else {
                    console.log("ERROR: failed to create service");
                    console.log(response);
                }
            }
        })
    },

    add_fields: (create_input) => {
        var layer_format = {
            "layers": [
                {
                    "adminLayerInfo":
                    {
                        "geometryField": {
                            "name": "Shape",
                            "srid":4326
                        }
                    },
                    "name": create_input.title,
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
                                "attributes": {}
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

        var squlType = "";
        var length = null;
        for (i = 0; i < create_input.fields.length; i++) {        
            length = null;
            switch(create_input.fields[i].type) {
                case "esriFieldTypeString":
                    squlType = "sqlTypeNVarchar";
                    length = 256;
                    break;
                case "esriFieldTypeInteger":
                    squlType = "sqlTypeInteger";
                    break;
                default:
                    squlType = "sqlTypeFloat";
            }
            
            layer_format.layers[0].fields.push({
                "name": create_input.fields[i].name,
                "type": create_input.fields[i].data,
                "alias": create_input.fields[i].name,
                "sqlType": squlType,
                "nullable": true,
                "editable": true,
                "domain": null,
                "defaultValue": null,
                "length": length
            });

            layer_format.layers[0].templates[0].prototype.attributes[create_input.fields[i].name] = null;
        }

        console.log(layer_format);

        var state = JSON.parse(sessionStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("addToDefinition", JSON.stringify(layer_format));
        var base_url = create_input.create_response.serviceurl + "/addToDefinition";
        var url = base_url.slice(0, 58) + "admin/" + base_url.slice(58);

        m.request({
            url: url,
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                new_layer.update_definition(create_input);
            }
            else {
                if (response.error.code == 403) {
                    m.route.set("/login");
                }
                else {
                    console.log("ERROR: failed to add fields");
                    console.log(response);
                }
            }
        })
    },

    update_definition: (create_input) => {
        var state = JSON.parse(sessionStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("updateDefinition", JSON.stringify({
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
        }));
        
        var base_url = create_input.create_response.serviceurl + "/updateDefinition";
        var url = base_url.slice(0, 58) + "admin/" + base_url.slice(58);

        m.request({
            url: url,
            method: "POST",
            body: body, 
        })
        .then((response) => {
            if (response.error == undefined) {
                m.route.set("/create");
            }
            else {
                if (response.error.code == 403) {
                    m.route.set("/login");
                }
                else {
                    console.log("ERROR: failed to add fields");
                    console.log(response);
                }
            }
        })
    }
}

module.exports = new_layer;