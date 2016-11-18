
//common properties for the JSON editor
JSONEditor.defaults.options.theme = 'bootstrap3';
JSONEditor.defaults.options.iconlib = 'bootstrap3';
JSONEditor.defaults.options.disable_edit_json = true;
JSONEditor.plugins.sceditor.emoticonsEnabled = true;
JSONEditor.defaults.options.disable_collapse = true;

function defineStream(newAgent, i, mouseTop, mouseLeft) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $(propertyWindow).html('<div id="property-header"> Define Stream</div>' +
        '<div> <ul class="nav nav-tabs tab-pannel">' +
        '<li class="active"><a data-toggle="tab" href="#import-stream" class="import-stream">Import</a></li>' +
        '<li><a data-toggle="tab" href="#export-stream" class="export-stream">Export</a></li>' +
        '<li><a data-toggle="tab" href="#define-stream" class="define-stream">Define</a></li>' +
        '</ul></div>' +
        '<div id="import-stream" class="tab-pane fade" ></div>' +
        '<div id="export-stream" class="tab-pane fade"></div>' +
        '<div id="define-stream" class="tab-pane fade"></div>');

    var header = document.getElementById('property-header');
    //generate the form to define a stream
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
        disable_properties: true,
        disable_array_delete_all_rows: true,
        disable_array_delete_last_row: true
    });

    $(propertyWindow).append('<div id="submit"><button>Submit</button></div>');
    //'Submit' button action
    document.getElementById('submit').addEventListener('click', function () {
        var option = 'import';
        $(propertyWindow).find('ul > li').each(function () {
            if ($(this).attr('class') == 'active') {
                option = ($(this).find('a')).attr('class');
            }
        });
        // create a new stream model and add to the collection
        var newStream = new app.Stream;
        newStream.set('id', i);
        newStream.set('name', editor.getValue().name);
        newStream.set('type', option);
        newStream.set('attributes', editor.getValue().attributes);
        streamList.add(newStream);
        //close the property window
        $(propertyWindow).html('');
        $(propertyWindow).collapse('hide');
        dropStream(newAgent, i, option, mouseTop, mouseLeft, editor.getValue().name);
    });

}

/**
 * @function generate the property window for the queries ( passthrough, filter and window)
 * @param element selected element(query)
 */
function generatePropertiesFormForQueries(element) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $("#container").addClass('disabledbutton');
    $("#toolbox").addClass('disabledbutton');
    var id = $(element).parent().attr('id');
    var clickedElement = queryList.get(id);
    var queryType = $(element).parent().attr('class');
    if (clickedElement.get('inStream') == '') {
        alert('Connect to streams');
        $("#container").removeClass('disabledbutton');
        $("#toolbox").removeClass('disabledbutton');
    }
    else if (clickedElement.get('outStream') == '') {
        //retrieve the query information from the collection
        var name = clickedElement.get('name');
        var inStream = (streamList.get(clickedElement.get('inStream'))).get('name');
        var filter1 = clickedElement.get('filter1');
        var window = clickedElement.get('window');
        var filter2 = clickedElement.get('filter2');

        var fillWith;
        if (queryType == 'squerydrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                attributes: ''
            };
        }
        else if (queryType == 'filterdrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                filter1: filter1,
                attributes: ''
            };
        }
        else if (queryType == 'wquerydrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                window: window,
                attributes: ''
            };
        }
        //generate the form for the query an output stream is not connected
        var editor = new JSONEditor(document.getElementById('propertypane'), {
            schema: {
                type: 'object',
                title: 'Query',
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                        required: true,
                        propertyOrder: 1
                    },
                    from: {
                        type: 'string',
                        title: 'From',
                        required: true,
                        propertyOrder: 2
                    },
                    filter1: {
                        type: 'string',
                        title: 'Filter 1',
                        propertyOrder: 3
                    },
                    window: {
                        type: 'string',
                        title: 'Window',
                        propertyOrder: 4
                    },
                    filter2: {
                        type: 'string',
                        title: 'Filter 2',
                        propertyOrder: 5
                    },
                    outStream: {
                        type: 'string',
                        title: 'Output Stream',
                        propertyOrder: 6,
                        required: true
                    },
                    attributes: {
                        type: 'array',
                        title: 'Attributes',
                        format: 'table',
                        required: true,
                        propertyOrder: 7,
                        uniqueItems: true,
                        items: {
                            type: 'object',
                            properties: {
                                select: {
                                    type: 'string',
                                    title: 'select'
                                },
                                newName: {
                                    type: 'string',
                                    title: 'as'
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
            startval: fillWith,
            disable_array_add: false,
            disable_array_delete: false,
            disable_array_reorder: true,
            display_required_only: true,
            no_additional_properties: true
            });
        //disable the uneditable fields
        editor.getEditor('root.from').disable();

        $(propertyWindow).append('<div><button id="form-submit">Submit</button>' +
            '<button id="form-cancel">Cancel</button></div>');

        //'Save' button action
        document.getElementById('form-submit').addEventListener('click', function () {
            $("#container").removeClass('disabledbutton');
            $("#toolbox").removeClass('disabledbutton');
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
            var config = editor.getValue();

            //change the query icon depending on the fileds filled
            if (config.window) {
                $(element).parent().removeClass();
                $(element).parent().addClass('wquerydrop ui-draggable');
            }
            else if (config.filter1 || config.filter2) {
                $(element).parent().removeClass();
                $(element).parent().addClass('filterdrop ui-draggable');
            }
            else if (!(config.filter1 || config.filter2 || config.window )) {
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }
            //obtain values from the form and update the query model
            var config = editor.getValue();
            clickedElement.set('name', config.name);
            clickedElement.set('filter1', config.filter1);
            clickedElement.set('window', config.window);
            clickedElement.set('filter2', config.filter2);
            var streamAttributes = [];
            var queryAttributes = [];
            $.each( config.attributes, function( key, value ) {
                streamAttributes.push({ name : value.newName , type : value.type});
                queryAttributes.push({ select : value.select , newName : value.newName});
            });
            clickedElement.set('attributes', queryAttributes);
            var textNode = $(element).parent().find('.queryNameNode');
            textNode.html(config.name);
            //generate the stream defined as the output stream
            var position = $(element).parent().position();
            dropStreamFromQuery(position, id, config.outStream, streamAttributes );
        });

        //'Cancel' button action
        document.getElementById('form-cancel').addEventListener('click', function () {
            $("#container").removeClass('disabledbutton');
            $("#toolbox").removeClass('disabledbutton');
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
        });
    }
    else {
        //retrieve the query information from the collection
        var name = clickedElement.get('name');
        var inStream = (streamList.get(clickedElement.get('inStream'))).get('name');
        var outStream = (streamList.get(clickedElement.get('outStream'))).get('name');
        var filter1 = clickedElement.get('filter1');
        var window = clickedElement.get('window');
        var filter2 = clickedElement.get('filter2');
        var attrString = [];
        var outStreamAttributes;
        if (clickedElement.get('attributes') == '') {
            outStreamAttributes = (streamList.get(clickedElement.get('outStream'))).get('attributes');
            for (var i = 0; i < outStreamAttributes.length; i++) {
                var attr = {select: '', newName: outStreamAttributes[i].name};
                attrString.push(attr);
            }
        }
        else {
            outStreamAttributes = clickedElement.get('attributes');
            for (var i = 0; i < outStreamAttributes.length; i++) {
                var attr = {select: outStreamAttributes[i].select, newName: outStreamAttributes[i].newName};
                attrString.push(attr);
            }
        }

        var fillWith;
        if (queryType == 'squerydrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                attributes: attrString,
                into: outStream
            };
        }
        else if (queryType == 'filterdrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                filter1: filter1,
                attributes: attrString,
                into: outStream
            };
        }
        else if (queryType == 'wquerydrop ui-draggable') {
            fillWith = {
                name: name,
                from: inStream,
                window: window,
                attributes: attrString,
                into: outStream
            };
        }
        //generate for for the queries where both input and output streams are defined
        var editor = new JSONEditor(document.getElementById('propertypane'), {
            schema: {
                type: 'object',
                title: 'Query',
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                        required: true,
                        propertyOrder: 1
                    },
                    from: {
                        type: 'string',
                        title: 'From',
                        template: inStream,
                        required: true,
                        propertyOrder: 2
                    },
                    filter1: {
                        type: 'string',
                        title: 'Filter 1',
                        propertyOrder: 3
                    },
                    window: {
                        type: 'string',
                        title: 'Window',
                        propertyOrder: 4
                    },
                    filter2: {
                        type: 'string',
                        title: 'Filter 2',
                        propertyOrder: 5
                    },
                    attributes: {
                        type: 'array',
                        title: 'Attributes',
                        format: 'table',
                        required: true,
                        propertyOrder: 6,
                        items: {
                            type: 'object',
                            properties: {
                                select: {
                                    type: 'string',
                                    title: 'select'
                                },
                                newName: {
                                    type: 'string',
                                    title: 'as'
                                }
                            }
                        }
                    },
                    into: {
                        type: 'string',
                        template: outStream,
                        required: true,
                        propertyOrder: 7
                    }
                }
            },
            startval: fillWith,
            disable_array_add: true,
            disable_array_delete: true,
            disable_array_reorder: true,
            display_required_only: true,
            no_additional_properties: true
        });

        //disable fields that can not be changed
        editor.getEditor('root.from').disable();
        editor.getEditor('root.into').disable();
        for (var i = 0; i < outStreamAttributes.length; i++) {
            editor.getEditor('root.attributes.' + i + '.newName').disable();
        }

        $(propertyWindow).append('<div><button id="form-submit">Submit</button>' +
            '<button id="form-cancel">Cancel</button></div>');

        document.getElementById('form-submit').addEventListener('click', function () {
            $("#container").removeClass('disabledbutton');
            $("#toolbox").removeClass('disabledbutton');
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
            var config = editor.getValue();

            //change the query icon depending on the fields(filter, window) filled
            if (config.window) {
                $(element).parent().removeClass();
                $(element).parent().addClass('wquerydrop ui-draggable');
            }
            else if (config.filter1 || config.filter2) {
                $(element).parent().removeClass();
                $(element).parent().addClass('filterdrop ui-draggable');
            }
            else if (!(config.filter1 || config.filter2 || config.window )) {
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }

            //update selected query model
            clickedElement.set('name', config.name);
            clickedElement.set('filter1', config.filter1);
            clickedElement.set('window', config.window);
            clickedElement.set('filter2', config.filter2);
            clickedElement.set('attributes', config.attributes);

            var textNode = $(element).parent().find('.queryNameNode');
            textNode.html(config.name);
        });

        //'Cancel' button action
        document.getElementById('form-cancel').addEventListener('click', function () {
            $("#container").removeClass('disabledbutton');
            $("#toolbox").removeClass('disabledbutton');
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
        });
    }
}