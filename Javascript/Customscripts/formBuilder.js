/**
 * Created by pamoda on 11/8/16.
 */
JSONEditor.defaults.options.theme = 'bootstrap3';
JSONEditor.defaults.options.iconlib = 'bootstrap3';
JSONEditor.plugins.sceditor.emoticonsEnabled = true;
function generateForms() {
    var inStream = "inputStream";
    var outStream = "outputStream";
    var starting_value = {};
    var editor = new JSONEditor(document.getElementById('propertypane'), {
        schema: {
            type: "object",
            title: "Query",
            properties: {
                name: {
                    type: "string",
                    title: "Name"
                },
                from: {
                    type: "string",
                    title: "From",
                    template: inStream
                },
                filter: {
                    type: "string",
                    title: "Filter"
                },
                attributes: {
                    type: "array",
                    format: "table",
                    title: "Attributes",
                    uniqueItems: true,
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            type: {
                                type: "string",
                                enum: [
                                    "int",
                                    "long",
                                    "float",
                                    "double",
                                    "boolean"
                                ],
                                default: "int"
                            }
                        }
                    }
                },

                to: {
                    type: "string",
                    template: outStream
                }
            }
        },
        // Seed the form with a starting value
        startval: starting_value,
        no_additional_properties: true,
        required_by_default: true,
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        theme: "html"
    });
    var submitButton = document.getElementById('submit');
    $(submitButton).append("<button>Submit</button>");
    document.getElementById('submit').addEventListener('click', function () {
        // Get the value from the editor
        console.log(editor.getValue());
    });
}

function defineStream(newAgent, i, kind, mouseTop, mouseLeft) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $(propertyWindow).html('<div id="property-header"> Define Stream</div>'+
        '<div> <ul class="nav nav-tabs">'+
        '<li><a data-toggle="tab" href="#import-stream">Import</a></li>' +
        '<li><a data-toggle="tab" href="#export-stream">Export</a></li>' +
        '<li><a data-toggle="tab" href="#define-stream">Define</a></li>' +
        '</ul></div>' +
        '<div id="import-stream" class="tab-pane fade" ></div>' +
        '<div id="export-stream" class="tab-pane fade"></div>' +
        '<div id="define-stream" class="tab-pane fade"></div>' +
        '<div id="submit"></div>');

    var header = document.getElementById('property-header');
    var editor = new JSONEditor(document.getElementById('define-stream'), {
        schema: {
            type: "object",
            title: "Stream",
            properties: {
                name: {
                    type: "string",
                    title: "Name"
                },
                attributes: {
                    type: "array",
                    format: "table",
                    title: "Attributes",
                    uniqueItems: true,
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            type: {
                                type: "string",
                                enum: [
                                    "int",
                                    "long",
                                    "float",
                                    "double",
                                    "boolean"
                                ],
                                default: "int"
                            }
                        }
                    }
                }
            }
        },
        no_additional_properties: true,
        required_by_default: true,
        disable_collapse: true,
        disable_edit_json: true,
        disable_properties: true,
        disable_array_delete_all_rows: true,
        disable_array_delete_last_row: true
    });
    var submitButton = document.getElementById('submit');
    $(submitButton).append("<button>Submit</button>");
    document.getElementById('submit').addEventListener('click', function () {
        // Get the value from the editor
        var newStream = new app.Stream;
        newStream.set('id', i);
        newStream.set('name', editor.getValue().name);
        newStream.set('type', 'defined');
        newStream.set('attributes', editor.getValue().attributes);
        streamList.add(newStream);
        $(document.getElementById('')).html('');
        $(propertyWindow).collapse('hide');
        dropStream(newAgent, i, kind, mouseTop, mouseLeft);
        i++;    //Increment the Element ID for the next dropped Element
        finalElementCount = i;
    });

    var inStream = "inputStream";
    var outStream = "outputStream";
    var starting_value = {};
    // var editor = new JSONEditor(document.getElementById('propertypane'),{
    //     schema: {
    //         type: "object",
    //         title: "Query",
    //         properties: {
    //             name:{
    //                 type :"string",
    //                 title: "Name"
    //             },
    //             from: {
    //                 type :"string",
    //                 title: "From",
    //                 template : inStream
    //             },
    //             filter: {
    //                 type: "string",
    //                 title: "Filter"
    //             },
    //             attributes: {
    //                 type: "array",
    //                 format: "table",
    //                 title: "Attributes",
    //                 uniqueItems : true,
    //                 items : {
    //                     type : "object",
    //                     properties: {
    //                         name: {
    //                             type: "string"
    //                         },
    //                         type: {
    //                             type: "string",
    //                             enum: [
    //                                 "int",
    //                                 "long",
    //                                 "float",
    //                                 "double",
    //                                 "boolean"
    //                             ],
    //                             default: "int"
    //                         }
    //                     }
    //                 }
    //             },
    //
    //             to: {
    //                 type: "string",
    //                 template : outStream
    //             }
    //         }
    //     },
    //     // Seed the form with a starting value
    //     startval: starting_value,
    //     no_additional_properties: true,
    //     required_by_default: true,
    //     disable_collapse : true,
    //     disable_edit_json :true,
    //     disable_properties : true,
    //     theme : "html"
    // });

}