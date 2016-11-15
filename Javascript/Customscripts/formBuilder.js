/**
 * Created by pamoda on 11/8/16.
 */
JSONEditor.defaults.options.theme = 'bootstrap3';
JSONEditor.defaults.options.iconlib = 'bootstrap3';
JSONEditor.defaults.options.disable_edit_json =true;
JSONEditor.plugins.sceditor.emoticonsEnabled = true;
JSONEditor.defaults.options.disable_collapse =true;

function defineStream(newAgent,i,mouseTop, mouseLeft) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $(propertyWindow).html('<div id="property-header"> Define Stream</div>'+
        '<div> <ul class="nav nav-tabs tab-pannel">'+
        '<li class="active"><a data-toggle="tab" href="#import-stream" class="import-stream">Import</a></li>' +
        '<li><a data-toggle="tab" href="#export-stream" class="export-stream">Export</a></li>' +
        '<li><a data-toggle="tab" href="#define-stream" class="define-stream">Define</a></li>' +
        '</ul></div>' +
        '<div id="import-stream" class="tab-pane fade" ></div>' +
        '<div id="export-stream" class="tab-pane fade"></div>' +
        '<div id="define-stream" class="tab-pane fade"></div>' );

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
        disable_properties :true,
        disable_array_delete_all_rows: true,
        disable_array_delete_last_row: true
    });

    $(propertyWindow).append('<div id="submit"><button>Submit</button></div>');
    document.getElementById('submit').addEventListener('click', function () {
        var option='import';
        $(propertyWindow).find('ul > li').each(function () {
            if ($(this).attr('class') == 'active'){
                option =($(this).find('a')).attr('class');
            }
        });
        var newStream = new app.Stream;
        newStream.set('id', i);
        newStream.set('name', editor.getValue().name);
        newStream.set('type', option);
        newStream.set('attributes', editor.getValue().attributes);
        streamList.add(newStream);
        $(propertyWindow).html('');
        $(propertyWindow).collapse('hide');
        dropStream(newAgent, i, option, mouseTop, mouseLeft , editor.getValue().name);
    });

}

function generatePropertiesFormForQueries(element) {
    var propertyWindow = document.getElementsByClassName('property');
    $(propertyWindow).collapse('show');
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");
    var id = $(element).parent().attr('id');
    var clickedElement = queryList.get(id) ;
    var queryType = $(element).parent().attr('class');
    // var filterRequired = false;
    // var windowRequired =false;
    // if( queryType == 'filterdrop ui-draggable'){
    //     filterRequired = true;
    // }
    // else if(queryType == 'wquerydrop ui-draggable'){
    //     windowRequired = true;
    //     filterRequired = true;
    // }
    if (clickedElement.get('inStream')== "" || clickedElement.get('outStream') ==""){
        alert('Connect to streams');
        $("#container").removeClass("disabledbutton");
        $("#toolbox").removeClass("disabledbutton");
    }
    else{
        var inStream = (streamList.get(clickedElement.get('inStream'))).get('name');
        var outStream = (streamList.get(clickedElement.get('outStream'))).get('name');
        var outStreamAttributes = (streamList.get(clickedElement.get('outStream'))).get('attributes');
        var attrString= [];
        for (var i=0 ; i<outStreamAttributes.length ; i++){
            var attr = { select : '' , newName : outStreamAttributes[i].name };
            attrString.push(attr);
        }
        var test = [{select : '' , newName : 'attr2'},{select : '', newName : 'attr'}];
        var fillWith = {
            name:'',
            from : inStream,
            // filter1:'sdf',
            // window: 'sf',
            // filter2 : 'hty',
            attributes : attrString,
            into : outStream

        };
        var editor = new JSONEditor(document.getElementById('propertypane'), {
            schema: {
                type: "object",
                title: "Query",
                properties: {
                    name: {
                        type: "string",
                        title: "Name",
                        required:true,
                        propertyOrder: 1
                    },
                    from: {
                        type: "string",
                        title: "From",
                        template: inStream,
                        required:true,
                        propertyOrder: 2
                    },
                    filter1: {
                        type: "string",
                        title: "Filter 1",
                        propertyOrder: 3
                    },
                    window: {
                        type: "string",
                        title: "Window",
                        propertyOrder: 4
                    },
                    filter2: {
                        type: "string",
                        title: "Filter 2",
                        propertyOrder: 5
                    },
                    attributes: {
                        type: "array",
                        title: 'Attributes',
                        format : 'table',
                        required:true,
                        propertyOrder: 6,
                        items: {
                            type: "object",
                            properties:{
                                select:{
                                    type : 'string',
                                    title :'select'
                                },
                                newName:{
                                    type : 'string',
                                    title :'as'
                                }

                            }
                        }
                    },
                    into: {
                        type: "string",
                        template: outStream,
                        required:true,
                        propertyOrder: 7
                    }
                }
            },
            startval: fillWith,
            disable_array_add :true,
            disable_array_delete: true,
            disable_array_reorder:true,
            display_required_only: true,
            no_additional_properties: true
        });
        $(propertyWindow).append('<div><button id="form-submit">Submit</button>' +
            '<button id="form-cancel">Cancel</button></div>');
        document.getElementById('form-submit').addEventListener('click', function () {

            $("#container").removeClass("disabledbutton");
            $("#toolbox").removeClass("disabledbutton");
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
            var config = editor.getValue();
            if (config.filter1 == undefined && config.filter2 == undefined && config.window == undefined){
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }
            else if(config.filter1 == '' || config.filter2 == '' || config.window == ''){
                $(element).parent().removeClass();
                $(element).parent().addClass('squerydrop ui-draggable');
            }
            else if(config.window != ''){
                $(element).parent().removeClass();
                $(element).parent().addClass('wquerydrop ui-draggable');
            }
            else if(config.filter1 != '' || config.filter2 != ''){
                $(element).parent().removeClass();
                $(element).parent().addClass('filterdrop ui-draggable');
            }
            clickedElement.set('name', config.name);
            clickedElement.set('filter1', config.filter1);
            clickedElement.set('window', config.window);
            clickedElement.set('filter2', config.filter2);
            var textNode = $(element).parent().find('.queryNameNode');
            textNode.html(config.name);
        });
        document.getElementById('form-cancel').addEventListener('click', function () {
            $("#container").removeClass("disabledbutton");
            $("#toolbox").removeClass("disabledbutton");
            $(propertyWindow).html('');
            $(propertyWindow).collapse('hide');
        });
    }

}