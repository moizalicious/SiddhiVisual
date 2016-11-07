var i = 1;

//droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
var droptype;

// finalElementCount --> Number of elements that exist on the canvas at the time of saving the model
var finalElementCount = 0;

/**
 * @description jsPlumb function opened
 */

jsPlumb.ready(function () {
    // jsPlumb.Defaults.Container = $("#container");
    jsPlumb.Defaults.PaintStyle = {strokeStyle: "darkblue", lineWidth: 2, dashstyle: '3 3'}; //Connector line style
    jsPlumb.Defaults.EndpointStyle = {radius: 7, fillStyle: "darkblue"}; //Connector endpoint/anchor style
    jsPlumb.importDefaults({Connector: ["Bezier", {curviness: 50}]}); //Connector line style
    jsPlumb.setContainer($('#container'));
    var canvas = $('#container');
    // $("#container").droppable({
    canvas.droppable({
        accept: '.stream, .receiver, .publisher, .execution-plan',
        containment: 'container',
        drop: function (e, ui) {

            //mouseTop, mouseLeft - To retrieve the mouse position at the time of drop so that the elements can be placed at the same spot
            //TODO retrieve offset with regard to the container and not the page
            var mouseTop = e.pageY - canvas.offset().top;
            var mouseLeft = e.pageX - canvas.offset().left;

            var dropElem = ui.draggable.attr('class');
            //Clone the element in the toolbox in order to drop the clone on the canvas
            droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).removeAttr("class");
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);
            var newAgent;
            //If the dropped Element is a Stream then->
            if (dropElem == "stream ui-draggable") {
                var streamModel = new app.Stream;
                streamModel.set('name' , 'streamX');
                streamModel.set('id' , i);
                streamList.add(streamModel);
                newAgent = $('<div>').attr('id', i).addClass('streamdrop');

                //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
                canvas.addClass("disabledbutton");
                $("#toolbox").addClass("disabledbutton");

                /*
                 Create a stream form where the user can set whether the dropped element is an Import/Export/defined stream
                 Element is not dropped on the canvas before the data is entered in the form as the user shouldn't be able to manipulate the
                 Stream element before it has been initialized
                 */

                canvas.append(newAgent);

                createStreamForm(newAgent, i, e, mouseTop, mouseLeft);
                i++;    //Increment the Element ID for the next dropped Element
                finalElementCount = i;
                enableElements();

            }

            //If the dropped Element is a receiver
            else if (dropElem == "receiver ui-draggable") {

                newAgent = $('<div>').attr('id', i).addClass('receiver-drop');
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropReceiver(newAgent, i, mouseTop, mouseLeft, "Receiver");
                i++;
                finalElementCount = i;
            }

            //If the dropped element is a publisher
            else if (dropElem == "publisher ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('publisher-drop');
                droptype = "squerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropPublisher(newAgent, i,mouseTop, mouseLeft, "Publisher");

                i++;
                finalElementCount = i;
            }

            //If the dropped element is a execution plan
            else if (dropElem == "execution-plan ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('execution-plan-drop');
                droptype = "squerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropExecutionPlan(newAgent, i,mouseTop, mouseLeft, "Plan");

                i++;
                finalElementCount = i;
            }
            closeButtonEvent(newAgent);
            settingsButtonEvent(newAgent)
        }
    });

    //restrict the invalid connections considering the source element and target.
    jsPlumb.bind('beforeDrop', function(connection) {
        var targetId = connection.targetId[0];
        var targetClass = $('#'+targetId).attr('class');
        var sourceId = connection.sourceId[0];
        var sourceClass = $('#'+sourceId).attr('class');
        var validity = true;
        if (sourceClass == 'streamdrop ui-draggable'){
            if(connection.sourceId[2]=='I'){
                if (!(targetClass == 'receiver-drop ui-draggable' || targetClass == 'execution-plan-drop ui-draggable')){
                    validity= false;
                }
            }
            if(connection.sourceId[2]=='O') {
                if (!(targetClass == 'publisher-drop ui-draggable' || targetClass == 'execution-plan-drop ui-draggable')) {
                    validity= false;
                }
            }
        }
        else if (sourceClass == 'receiver-drop ui-draggable'){
            if( targetClass != 'streamdrop ui-draggable'){
                validity= false;
            }
            else if (targetClass == 'streamdrop ui-draggable' && connection.targetId[2]=='O'){
                validity= false;
            }
        }
        else if (sourceClass == 'publisher-drop ui-draggable'){
            if (targetClass != 'streamdrop ui-draggable'){
                validity= false;
            }
            else if (targetClass == 'streamdrop ui-draggable' && connection.targetId[2]=='I'){
                validity= false;
            }
        }
        else if (sourceClass == 'execution-plan-drop ui-draggable'){
            if (targetClass != 'streamdrop ui-draggable'){
                validity= false;
            }
        }
        if (!validity){
            alert('Invalid connection');
        }
        return validity;
    });

    // Update the model when a connection is established
    jsPlumb.bind('connection' , function(connection){
        var targetId = connection.targetId[0];
        var targetClass = $('#'+targetId).attr('class');
        var sourceId = connection.sourceId[0];
        var sourceClass = $('#'+sourceId).attr('class');
        var model;
        if( targetClass == 'receiver-drop ui-draggable'){
            model = receiverList.get(targetId);
            model.set('stream' , sourceId);
        }
        else if ( sourceClass == 'receiver-drop ui-draggable'){
            model = receiverList.get(sourceId);
            model.set('stream' , targetId);
        }
        if( targetClass == 'publisher-drop ui-draggable'){
            model = publisherList.get(targetId);
            model.set('stream' , sourceId);
        }
        else if ( sourceClass == 'publisher-drop ui-draggable'){
            model = publisherList.get(sourceId);
            model.set('stream' , targetId);
        }
        var streams;
        if (targetClass == 'execution-plan-drop ui-draggable'){
            model = executionPlanList.get(targetId);
            if(connection.targetId[2]=='I'){
                streams = model.get('inStream');
                if (streams == undefined){
                    streams = [ sourceId]
                }
                else streams.push(sourceId);
                model.set('inStream', streams);
            }
            else if(connection.targetId[2]=='O') {
                streams = model.get('outStream');
                if (streams== undefined){
                    streams = [ sourceId]
                }
                else streams.push(sourceId);
                model.set('outStream', streams)
            }
        }
        else if (sourceClass =='execution-plan-drop ui-draggable' ){
            model = executionPlanList.get(sourceId);
            if(connection.sourceId[2]=='I'){
                streams = model.get('inStream');
                if (streams== undefined){
                    streams = [ targetId]
                }
                else streams.push(targetId);
                model.set('inStream', streams);
                }
            else if(connection.sourceId[2]=='O') {
                streams = model.get('outStream');
                if (streams== undefined){
                    streams = [ targetId]
                }
                else streams.push(targetId);
                model.set('outStream', streams)
            }
        }
    });

    jsPlumb.bind('connectionDetached', function (connection) {
        var targetId = connection.targetId[0];
        var targetClass = $('#'+targetId).attr('class');
        var sourceId = connection.sourceId[0];
        var sourceClass = $('#'+sourceId).attr('class');
        if( targetClass == 'receiver-drop ui-draggable'){
            var model = receiverList.get(targetId);
            if (model != undefined){
                model.set('stream' , '');
            }
        }
        else if ( sourceClass == 'receiver-drop ui-draggable'){
            var model = receiverList.get(sourceId);
            if (model != undefined){
                model.set('stream' , '');
            }
        }
        if( targetClass == 'publisher-drop ui-draggable'){
            var model = publisherList.get(targetId);
            if (model != undefined){
                model.set('stream' , '');
            }
        }
        else if ( sourceClass == 'publisher-drop ui-draggable'){
            var model = publisherList.get(sourceId);
            if (model != undefined){
                model.set('stream' , '');
            }
        }
        var streams;
        if( targetClass == 'execution-plan-drop ui-draggable'){
            var model = executionPlanList.get(targetId);
            if(connection.targetId[2]=='I'){
                streams = model.get('inStream');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream,1);
                model.set('inStream', streams);
            }
            else if(connection.targetId[2]=='O') {
                streams = model.get('outStream');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream,1);
                model.set('outStream', streams);
            }
        }
        else if ( sourceClass == 'execution-plan-drop ui-draggable'){
            var model = executionPlanList.get(sourceId);
            if(connection.sourceId[2]=='I'){
                streams = model.get('inStream');
                var removedStream = streams.indexOf(targetId);
                streams.splice(removedStream,1);
                model.set('inStream', streams);
            }
            else if(connection.sourceId[2]=='O') {
                streams = model.get('outStream');
                var removedStream = streams.indexOf(targetId);
                streams.splice(removedStream,1);
                model.set('outStream', streams);
            }
        }
    });

    //Display the model in Json format in the text area
    $('#saveButton').click(function () {
        saveEventFlow();
    });

    //Recreate the model based on the Json output provided
    $('#load-button').click(function (e) {
        console.log("clicked");
        reloadEventFlow(e);
    });


    function enableElements() {
        $(".receiver").css("opacity", 0.8);
        $(".publisher").css("opacity", 0.8);
        $(".execution-plan").css("opacity", 0.8);
        $(".receiver").draggable
        ({
            helper: 'clone',
            cursor: 'pointer',
            tolerance: 'fit',
            revert: true
        });

        $(".publisher").draggable
        ({
            helper: 'clone',
            cursor: 'pointer',
            tolerance: 'fit',
            revert: true
        });

        $(".execution-plan").draggable
        ({
            helper: 'clone',
            cursor: 'pointer',
            tolerance: 'fit',
            revert: true
        });
    }

    function saveEventFlow() {
        //node - Array that stores the element related information as objects
        var node = [];
        //matches - Array that stores element IDs of elements that exist on te canvas
        var matches = [];
        var totalElementCount = 0;
        //Get the element IDs of all the elements existing on the canvas
        var searchEles = document.getElementById("container").children;
        for (var i = 0; i < searchEles.length; i++) {
            matches.push(searchEles[i]);
            var idOfEl = searchEles[i].id;
            totalElementCount = idOfEl;

            if (searchEles[i].id != null || searchEles[i].id != "") {
                var $element = $("#" + searchEles[i].id);
                var dropElem = $("#" + searchEles[i].id).attr('class');
                var position = $element.position();

                //If the element is a stream
                if (dropElem == "streamdrop ui-draggable") {
                    position.bottom = position.top + $element.height();
                    position.right = position.left + $element.width();

                    /*Check whether the stream is an import, export or a defined stream by checking whether the ID exists in the
                     createdImportStreamArray, createdExportStreamArray or the createdDefinedStreamArray
                     Loop through 100 as these arrays have been initialized to hold 100 records where non-existent element records may be null.
                     Since these were intermediate storage points, objects werent created and arrays were used instead.
                     */
                    for (var count = 0; count < 100; count++) {
                        if (createdImportStreamArray[count][0] == idOfEl) {
                            node.push({
                                id: idOfEl,
                                class: dropElem,
                                position: {
                                    top: position.top,
                                    left: position.left,
                                    bottom: position.bottom,
                                    right: position.right
                                },
                                predefinedStream: createdImportStreamArray[count][1],
                                name: createdImportStreamArray[count][2],
                                kind: "import"
                            });

                        }
                        else if (createdExportStreamArray[count][0] == idOfEl) {
                            node.push({
                                id: idOfEl,
                                class: dropElem,
                                position: {
                                    top: position.top,
                                    left: position.left,
                                    bottom: position.bottom,
                                    right: position.right
                                },
                                predefinedStream: createdExportStreamArray[count][1],
                                name: createdExportStreamArray[count][2],
                                kind: "export"
                            });
                        }
                        else if (createdDefinedStreamArray[count][0] == idOfEl) {
                            var attrNum = createdDefinedStreamArray[count][2].length;
                            var attrArray = [];
                            for (var f = 0; f < attrNum - 1; f++) {
                                attrArray.push({
                                    attributeName: createdDefinedStreamArray[count][2][f][0],
                                    attributeType: createdDefinedStreamArray[count][2][f][1]
                                });
                            }

                            node.push({
                                id: idOfEl,
                                class: dropElem,
                                position: {
                                    top: position.top,
                                    left: position.left,
                                    bottom: position.bottom,
                                    right: position.right
                                },
                                name: createdDefinedStreamArray[count][1],
                                numberOfAttributes: createdDefinedStreamArray[count][4],
                                kind: "defined",
                                attributes: attrArray
                            });
                        }
                    }
                }

                else if (dropElem == "receiver-drop ui-draggable" || dropElem == "publisher-drop ui-draggable"
                    || dropElem == "execution-plan-drop ui-draggable") {
                    position.bottom = position.top + $element.height();
                    position.right = position.left + $element.width();
                    node.push({
                        id: idOfEl,
                        class: dropElem,
                        position: {
                            top: position.top,
                            left: position.left,
                            bottom: position.bottom,
                            right: position.right
                        }
                    });

                }

            }

        }

        //connections - Array that stores all connection related info. This is handled by jsPlumb's 'getConnections() method and not done manually
        var connections = [];
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            connections.push({
                connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });

        var flowChart = {};
        flowChart.node = node;
        flowChart.connections = connections;

        var flowChartJson = JSON.stringify(flowChart);
        //console.log(flowChartJson);

        $('#jsonOutput').val(flowChartJson);
    }

    function reloadEventFlow(e) {
        var flowChartJson = $('#jsonOutput').val();
        var flowChart = JSON.parse(flowChartJson);
        var elements = flowChart.node;
        var connections = flowChart.connections;
        $.each(elements , function (index,element) {
            var id = element.id;
            var elementType = element.class;
            var kind = element.kind;
            var top = element.position.top;
            var bottom = element.position.bottom;
            var left = element.position.left;
            var right = element.position.right;
            droppedElement= document.getElementById(id);
            if (id != null && id != "" && id != undefined) {
                var newAgent;
                if (elementType == "streamdrop ui-draggable") {
                    //create a model for the stream
                    var streamModel = new app.Stream;
                    streamModel.set('name' , 'streamX');
                    streamModel.set('id' , i);
                    streamList.add(streamModel);

                    var node = document.createElement("div");
                    node.id = id + "-nodeInitial";
                    node.className = "streamNameNode";

                    var asName = element.name;
                    var textnode = document.createTextNode(asName);
                    textnode.id = id + "-textnodeInitial";
                    node.appendChild(textnode);

                    var selectedStream = element.predefinedStream;
                    if (kind == "import") {
                        createdImportStreamArray[id - 1][0] = id;
                        createdImportStreamArray[id - 1][1] = selectedStream;
                        createdImportStreamArray[id - 1][2] = asName;
                        createdImportStreamArray[id - 1][3] = "Import";
                        newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                        var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propImportStream'));
                        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                        newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                        dropCompleteElement(newAgent, id, e, kind, top, left);
                        closeButtonEvent(newAgent);
                        settingsButtonEvent(newAgent);
                    }
                    else if (kind == "export") {

                        createdExportStreamArray[id - 1][0] = id;
                        createdExportStreamArray[id - 1][1] = selectedStream;
                        createdExportStreamArray[id - 1][2] = asName;
                        createdExportStreamArray[id - 1][3] = "Export";

                        newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                        var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propExportStream'));
                        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                        newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                        dropCompleteElement(newAgent, id, e, kind, top, left);
                        closeButtonEvent(newAgent);
                        settingsButtonEvent(newAgent);

                    }
                    else if (kind == "defined") {
                        var tblerows = element.numberOfAttributes;
                        createdDefinedStreamArray[id][0] = id;
                        createdDefinedStreamArray[id][1] = asName;
                        createdDefinedStreamArray[id][3] = "Defined Stream";
                        createdDefinedStreamArray[id][4] = tblerows;
                        createdDefinedStreamArray[id][2] = [];
                        var attrArray = element.attributes;

                        var r = 0;
                        $.each(attrArray, function (index, elem) {
                            //alert("attrName: " + elem.attributeName + "\nattrType: " + elem.attributeType+"\nr:"+r);
                            createdDefinedStreamArray[id][2][r] = new Array(2);
                            createdDefinedStreamArray[id][2][r][0] = elem.attributeName;
                            createdDefinedStreamArray[id][2][r][1] = elem.attributeType;
                            r++;
                        });

                        newAgent = $('<div style="top:' + top + ';bottom:' + bottom + ';left:' + left + ';right:' + right + '">').attr('id', id).addClass('streamdrop');
                        var prop = $('<a onclick="doclick(this)"><b><img src="../Images/settings.png" class="settingsIconLoc"></b></a> ').attr('id', (id + '-propDefinedStream'));
                        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefined"></b></a> ').attr('id', (id + 'vis'));
                        newAgent.append(node).append('<a class="boxclose" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);
                        dropCompleteElement(newAgent, id, e, kind, top, left);
                        closeButtonEvent(newAgent);
                        settingsButtonEvent(newAgent);
                    }
                }

                if (elementType == "receiver-drop ui-draggable") {
                    newAgent = $('<div>').attr('id', id).addClass('receiver-drop');
                    dropReceiver(newAgent, id, top, left, "Receiver");
                    closeButtonEvent(newAgent);
                    settingsButtonEvent(newAgent);
                }

                else if (elementType == "publisher-drop ui-draggable") {
                    newAgent = $('<div>').attr('id', id).addClass('publisher-drop');
                    dropPublisher(newAgent, id, top, left, "Publisher");
                    closeButtonEvent(newAgent);
                    settingsButtonEvent(newAgent);
                }

                else if (elementType == "execution-plan-drop ui-draggable") {
                    newAgent = $('<div>').attr('id', id).addClass('execution-plan-drop');
                    dropExecutionPlan(newAgent, id, top, left, "Plan");
                    closeButtonEvent(newAgent);
                    settingsButtonEvent(newAgent);
                }
            }
        i = parseInt(id)+1;
        });
        $.each(connections, function (index, connection) {
            jsPlumb.connect({
                source: connection.pageSourceId,
                target: connection.pageTargetId,
                anchors: ["BottomCenter", [0.75, 0, 0, -1]]

            });
        });

        // numberOfElements = flowChart.numberOfElements;
    }

    function closeButtonEvent(newAgent) {
        //Remove Element Icon for the stream elements
        newAgent.on('click', '.element-close-icon', function () {
            if (newAgent.attr('class') == 'receiver-drop ui-draggable'){
                receiverList.remove([{ id : newAgent.attr('id')}]);
            }
            else if (newAgent.attr('class') == 'publisher-drop ui-draggable'){
                publisherList.remove([{ id : newAgent.attr('id')}]);
            }
            else if (newAgent.attr('class') == 'execution-plan-drop ui-draggable'){
                executionPlanList.remove([{ id : newAgent.attr('id')}]);
            }

            jsPlumb.remove(newAgent);
        });
        //Remove Element Icon for the stream elements
        newAgent.on('click', '.boxclose', function () {
            if (newAgent.attr('class') == 'streamdrop ui-draggable'){
                streamList.remove([{ id : newAgent.attr('id')}]);
            }
            jsPlumb.remove(newAgent);
        });
    }

    function settingsButtonEvent(newAgent) {
            newAgent.on('click', '.element-prop-icon', function () {
                var clickedModel;
                if (newAgent.attr('class') == 'receiver-drop ui-draggable'){
                    clickedModel = receiverList.get(newAgent.attr('id'));
                    alert( 'Name : ' + clickedModel.get('name')+ '\n'+
                        'Element ID : ' + clickedModel.get('id') + '\n'+
                        'Stream connected : ' + clickedModel.get('stream'));
                }
                else if (newAgent.attr('class') == 'publisher-drop ui-draggable'){
                    clickedModel = publisherList.get(newAgent.attr('id'));
                    alert( 'Name : ' + clickedModel.get('name')+ '\n'+
                        'Element ID : ' + clickedModel.get('id') + '\n'+
                        'Stream connected : ' + clickedModel.get('stream'));
                }
                else if (newAgent.attr('class') == 'execution-plan-drop ui-draggable'){
                    clickedModel = executionPlanList.get(newAgent.attr('id'));
                    alert( 'Name : ' + clickedModel.get('name')+ '\n'+
                        'Element ID : ' + clickedModel.get('id') + '\n'+
                        'Stream connected IN : ' + clickedModel.get('inStream')+ '\n'+
                        'Stream connected OUT : ' + clickedModel.get('outStream'));
                }


            });
    }



});