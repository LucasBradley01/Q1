var m = require("mithril");
var utl = require("./utl");

/*
This function of the system, creating a new layer, gets its own file because of the length of the
function and the complexity of the operation. There are three steps to creating a new layer.

First you must create the service, and you must add to definition (or add fields), and finally
you must update the definition. All three steps are vital for a properly working layer.*/
var mcreate = {
    // Step one create feature service
    create: (createInput) => {
        state = JSON.parse(window.localStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("tags", "");
        body.append("typeKeywords", "ArcGIS Server,Data,Feature Access,Feature Service,Service,Hosted Service");
        body.append("outputType", "featureService");
        
        // Documentation for this api call and createParameters parameter is at:
        // https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm
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
            "name": createInput.title
        }))

        // Documentation for this api call is at:
        // https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm
        m.request({
            url: "https://www.arcgis.com/sharing/rest/content/users/" + state.username + "/createService",
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                createInput.createResponse = response;
                // Commence step two
                mcreate.add_fields(createInput);
            }
            else {
                utl.handle(response);
            }
        })
    },

    // Step two add to definition or add fields
    add_fields: (createInput) => {
        // Documentation for addToDefinitoin api call and the addToDefinition parameter are available at:
        // https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm
        var layerFormat = {
            "layers": [
                {
                    "adminLayerInfo":
                    {
                        "geometryField": {
                            "name": "Shape",
                            "srid":4326
                        }
                    },
                    "name": createInput.title,
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

        // Here the fields are created and inserted into the
        // layerFormat object so that when the api call is made
        // all the desired layers are created and in the proper way
        var squlType = "";
        var length = null;
        for (i = 0; i < createInput.fields.length; i++) {        
            length = null;
            switch(createInput.fields[i].type) {
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
            
            // Below is the format for a field
            layerFormat.layers[0].fields.push({
                "name": createInput.fields[i].name,
                "type": createInput.fields[i].data,
                "alias": createInput.fields[i].name,
                "sqlType": squlType,
                "nullable": true,
                "editable": true,
                "domain": null,
                "defaultValue": null,
                "length": length
            });

            layerFormat.layers[0].templates[0].prototype.attributes[createInput.fields[i].name] = null;
        }
        var state = JSON.parse(window.localStorage.getItem("state"));
        var body = new FormData();
        body.append("token", state.token);
        body.append("f", "json");
        body.append("addToDefinition", JSON.stringify(layerFormat));
        var base_url = createInput.createResponse.serviceurl + "/addToDefinition";
        var url = base_url.slice(0, 58) + "admin/" + base_url.slice(58);

        // Documentation for addToDefinitoin api call is available at:
        // https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm
        m.request({
            url: url,
            method: "POST",
            body: body,
        })
        .then((response) => {
            if (response.error == undefined) {
                mcreate.update_definition(createInput);
            }
            else {
                utl.handle(response);
            }
        })
    },


    update_definition: (createInput) => {
        var state = JSON.parse(window.localStorage.getItem("state"));
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
        
        var base_url = createInput.createResponse.serviceurl + "/updateDefinition";
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
                utl.handle(response);
            }
        })
    }
}

module.exports = mcreate;