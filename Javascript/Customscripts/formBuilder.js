
//common properties for the JSON editor
JSONEditor.defaults.options.theme = 'bootstrap3';
JSONEditor.defaults.options.iconlib = 'bootstrap3';
JSONEditor.defaults.options.disable_edit_json = true;
JSONEditor.plugins.sceditor.emoticonsEnabled = true;
JSONEditor.defaults.options.disable_collapse = true;


function defineStream(newAgent, i, mouseTop, mouseLeft) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $(propertyWindow).html('<div id="property-header"><h3>Define Stream </h3></div>' +
        '<div id="define-stream" class="define-stream"></div>');

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
        var option = 'define-stream';

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
 * @function generate the property window for the simple queries ( passthrough, filter and window)
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
    if (clickedElement.get('from') == '') {
        alert('Connect to streams');
        $("#container").removeClass('disabledbutton');
        $("#toolbox").removeClass('disabledbutton');
    }
    else if (clickedElement.get('insert-into') == '') {
        //retrieve the query information from the collection
        var name = clickedElement.get('name');
        var inStream = (streamList.get(clickedElement.get('from'))).get('name');
        var filter1 = clickedElement.get('filter');
        var window = clickedElement.get('window');
        var filter2 = clickedElement.get('post-window-filter');

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
                        title: 'Filter',
                        propertyOrder: 3
                    },
                    window: {
                        type: 'string',
                        title: 'Window',
                        propertyOrder: 4
                    },
                    filter2: {
                        type: 'string',
                        title: 'Post Window Filter',
                        propertyOrder: 5
                    },
                    outputType: {
                        type: 'string',
                        title: 'Output Type',
                        propertyOrder: 5,
                        required: true

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
            else if (config.filter || config.filter2) {
                $(element).parent().removeClass();
                $(element).parent().addClass('filterdrop ui-draggable');
            }
            else if (!(config.filter || config.filter2 || config.window )) {
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }
            //obtain values from the form and update the query model
            var config = editor.getValue();
            clickedElement.set('name', config.name);
            clickedElement.set('filter', config.filter);
            clickedElement.set('window', config.window);
            clickedElement.set('post-window-filter', config.filter2);
            clickedElement.set('output-type', config.outputType);
            var streamAttributes = [];
            var queryAttributes = [];
            $.each( config.attributes, function(key, value ) {
                streamAttributes.push({ name : value.newName , type : value.type});
                queryAttributes.push(value.select);
            });
            clickedElement.set('projections', queryAttributes);
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
        var inStream = (streamList.get(clickedElement.get('from'))).get('name');
        var outStream = (streamList.get(clickedElement.get('insert-into'))).get('name');
        var filter1 = clickedElement.get('filter');
        var window = clickedElement.get('window');
        var filter2 = clickedElement.get('post-window-filter');
        var attrString = [];
        var outStreamAttributes = (streamList.get(clickedElement.get('insert-into'))).get('attributes');
        if (clickedElement.get('projections') == '') {
            for (var i = 0; i < outStreamAttributes.length; i++) {
                var attr = {select: '', newName: outStreamAttributes[i].name};
                attrString.push(attr);
            }
        }
        else {
            var selectedAttributes = clickedElement.get('projections');
            for (var i = 0; i < outStreamAttributes.length; i++) {
                var attr = {select: selectedAttributes[i], newName: outStreamAttributes[i].name};
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
            editor.getEditor('root.projections.' + i + '.newName').disable();
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
            else if (config.filter || config.filter2) {
                $(element).parent().removeClass();
                $(element).parent().addClass('filterdrop ui-draggable');
            }
            else if (!(config.filter || config.filter2 || config.window )) {
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }

            //update selected query model
            clickedElement.set('name', config.name);
            clickedElement.set('filter', config.filter);
            clickedElement.set('window', config.window);
            clickedElement.set('post-window-filter', config.filter2);
            var projections = [];
            $.each(config.projections, function (index, attribute) {
                console.log(attribute.select);
                projections.push(attribute.select);
            });
            clickedElement.set('projections', projections);
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

/**
 * @function generate the property window for an existing stream
 * @param element
 */
function generatePropertiesFormForStreams(element){
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $("#container").addClass('disabledbutton');
    $("#toolbox").addClass('disabledbutton');
    var id = $(element).parent().attr('id');

    //retrieve the stream information from the collection
    var clickedElement = streamList.get(id);
    var name = clickedElement.get('name');
    var attributes = clickedElement.get('attributes');
    var fillWith = {
        name : name,
        attributes : attributes
    };
    var editor = new JSONEditor(document.getElementById('propertypane'), {
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
        disable_array_delete_last_row: true,
        startval: fillWith
    });
    $(propertyWindow).append('<div><button id="form-submit">Submit</button>' +
        '<button id="form-cancel">Cancel</button></div>');

    document.getElementById('form-submit').addEventListener('click', function () {
        $("#container").removeClass('disabledbutton');
        $("#toolbox").removeClass('disabledbutton');
        $(propertyWindow).html('');
        $(propertyWindow).collapse('hide');
        var config = editor.getValue();

        //update selected stream model
        clickedElement.set('name', config.name);
        clickedElement.set('attributes', config.projections);

        var textNode = $(element).parent().find('.streamnamenode');
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

/**
 * @function generate property window for state machine
 * @param element
 */
function generatePropertiesFormForPattern(element){
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $("#container").addClass('disabledbutton');
    $("#toolbox").addClass('disabledbutton');
    var id = $(element).parent().attr('id');
    var clickedElement = patternList.get(id);
    console.log(clickedElement);
    if (clickedElement.get('into') == '') {
        alert('Connect to streams');
        $("#container").removeClass('disabledbutton');
        $("#toolbox").removeClass('disabledbutton');
    }
    else {
        //retrieve the query information from the collection
        var name = clickedElement.get('name');
        var states = clickedElement.get('states');
        var logic = clickedElement.get('logic');
        var having = clickedElement.get('having');
        var groupby = clickedElement.get('groupby');
        var into = (streamList.get(clickedElement.get('into'))).get('name');
        var streams= [];
        $.each(clickedElement.get('from') , function(index, streamID){
            streams.push((streamList.get(streamID)).get('name'));
        });

        var fillWith = {
            name: name,
            states :states,
            logic: logic,
            having: having,
            groupby: groupby,
            into: into
        };

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
                    states: {
                        type: 'array',
                        title: 'state',
                        uniqueItems: true,
                        required: true,
                        propertyOrder: 2,
                        items: {
                            type: 'object',
                            properties: {
                                stateID: {
                                    type: 'string',
                                    title: 'State ID'
                                },
                                stream: {
                                    type: 'string',
                                    title: 'Stream',
                                    enum: streams
                                },
                                filter:{
                                    type: 'string',
                                    title: 'Filter'
                                }
                            }
                        }
                    },
                    logic: {
                        type: 'string',
                        title: 'logic',
                        required: true,
                        propertyOrder: 3
                    },
                    having: {
                        type: 'string',
                        title: 'having',
                        propertyOrder: 4
                    },
                    groupby: {
                        type: 'string',
                        title: 'group by',
                        propertyOrder: 5
                    },
                    into: {
                        type: 'string',
                        template: into,
                        required: true,
                        propertyOrder: 7
                    }
                }
            },
            startval: fillWith,
            disable_properties: true,
            disable_array_delete_all_rows: true,
            disable_array_delete_last_row: true,
            disable_array_reorder: true
        });

        //disable fields that can not be changed
        editor.getEditor('root.into').disable();
        $(propertyWindow).append('<div><button id="form-submit">Submit</button>' +
            '<button id="form-cancel">Cancel</button></div>');

        document.getElementById('form-submit').addEventListener('click', function () {
            $("#container").removeClass('disabledbutton');
            $("#toolbox").removeClass('disabledbutton');
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
            var config = editor.getValue();

            //update selected query model
            clickedElement.set('name', config.name);
            clickedElement.set('logic', config.logic);
            clickedElement.set('having', config.having);
            clickedElement.set('groupby', config.groupby);
            var states =[];

            $.each(config.states, function (index, state) {
                var stateID = state.stateID;
                var stream = state.stream;
                var filter = state.filter;
               var stateObject = { stateID  : { stream : stream , filter: filter} };
               states.push(stateObject);
            });
            clickedElement.set('states' , states);
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
}}
