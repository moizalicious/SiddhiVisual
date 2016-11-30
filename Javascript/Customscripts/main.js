// i --> newAgent ID (Dropped Element ID)
var i = 1;
// finalElementCount --> Number of elements that exist on the canvas at the time of saving the model
var finalElementCount=0;

/**
 * @description jsPlumb function opened
 */

jsPlumb.ready(function() {

    jsPlumb.Defaults.PaintStyle = {strokeStyle: "darkblue",outlineColor:"transparent", outlineWidth:"25", lineWidth: 2 }; //Connector line style
    jsPlumb.Defaults.HoverPaintStyle = { strokeStyle: 'darkblue',lineWidth : 3};
    jsPlumb.Defaults.EndpointStyle = {radius: 3}; //Connector endpoint/anchor style
    jsPlumb.Defaults.Overlays =[["Arrow",  {location:1.0, id:"arrow" }] ];
    jsPlumb.importDefaults({
        ConnectionsDetachable:false,
        Connector: ["Bezier", {curviness: 50}]
    }); //Connector line style
    jsPlumb.setContainer($('#container'));
    var canvas = $('#container');

    /**
     * @function enable dragging for stream
     * @helper clone
     */
    $(".stream").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'window' tool
     * @helper clone
     */
    $(".wstream").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Pass through query' tool
     * @helper clone
     */
    $(".squery").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Filter query' tool
     * @helper clone
     */
    $(".filter").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'windows query' tool
     * @helper clone
     */
    $(".wquery").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Join query' tool
     * @helper clone
     */
    $(".joquery").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'state-machine query' tool
     * @helper clone
     */
    $(".stquery").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Partition' tool
     * @helper clone
     */
    $(".partition").draggable({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function droppable method for the 'stream' & the 'query' objects
     */
    canvas.droppable
    ({
        accept: '.stream, .wstream , .squery, .filter, .wquery, .joquery, .stquery , .partition',
        containment: 'container',

        /**
         *
         * @param e --> original event object fired/ normalized by jQuery
         * @param ui --> object that contains additional info added by jQuery depending on which interaction was used
         * @helper clone
         */

        drop: function (e, ui) {
            var mouseTop = e.pageY - canvas.offset().top +canvas.scrollTop()- 40;
            var mouseLeft = e.pageX - canvas.offset().left +canvas.scrollLeft()- 60;
            var dropElem = ui.draggable.attr('class');
            //Clone the element in the toolbox in order to drop the clone on the canvas
            droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).removeAttr("class");
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);
            //droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
            var droptype;
            var newAgent;
            //If the dropped Element is a Stream then->
            if (dropElem == "stream ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('streamdrop ');

                //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
                canvas.addClass("disabledbutton");
                $("#toolbox").addClass("disabledbutton");

                canvas.append(newAgent);
                //generate the stream definition form
                defineStream(newAgent,i,mouseTop,mouseLeft);
                finalElementCount = i;
                i++;    //Increment the Element ID for the next dropped Element

            }

            //If the dropped Element is a Window(not window query) then->
            else if (dropElem == "wstream ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('wstreamdrop');
                //Drop the element instantly since its projections will be set only when the user requires it
                dropWindowStream(newAgent, i,mouseTop,mouseLeft,"Window");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Pass through Query then->
            else if (dropElem == "squery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('squerydrop ');
                droptype = "squerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Filter query then->
            else if (dropElem == "filter ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('filterdrop ');
                droptype = "filterdrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Window Query then->
            else if (dropElem == "wquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('wquerydrop ');
                droptype = "wquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Join Query then->
            else if (dropElem == "joquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('joquerydrop');
                droptype = "joquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a State machine Query(Pattern and Sequence) then->
            else if(dropElem == "stquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('stquerydrop');
                droptype = "stquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Partition then->
            else{
                newAgent = $('<div>').attr('id', i).addClass('partitiondrop');
                droptype = "partitiondrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropPartition(newAgent,i,mouseTop,mouseLeft);
                finalElementCount=i;
                i++;
            }
            registerElementEventListeners(newAgent);
        }
    });

    //Display the model in Json format in the text area
    $('#saveButton').click(function(){
        saveFlowchart();
        //generateForms();
    });

    //Export the generated Json output as a text file for storage purposes
    $('#exportButton').click(function(){
        exportFlowChart();
    });

    //Recreate the model based on the Json output provided
    $('#loadButton').click(function(e){
        loadFlowchart(e);
    });

    //auto align the diagram when the button is clicked
    $('#auto-align').click(function(){
        autoAlign();
    });

});

//check the validity of the connections and drop if invalid
jsPlumb.bind('beforeDrop', function(connection){
    var connectionValidity= true;
    var target = connection.targetId;
    var targetId= target.substr(0, target.indexOf('-'));
    var targetClass = $('#'+targetId).attr('class');

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceClass = $('#'+sourceId).attr('class');

    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable' || targetClass == 'wquerydrop ui-draggable'
        || targetClass == 'stquerydrop ui-draggable' || targetClass == 'joquerydrop ui-draggable') {
        if (sourceClass != 'streamdrop ui-draggable') {
            connectionValidity = false;
            alert("Invalid Connection");
        }
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable' || sourceClass == 'wquerydrop ui-draggable'
        || sourceClass == 'stquerydrop ui-draggable' || sourceClass == 'joquerydrop ui-draggable'){
        if(targetClass != 'streamdrop ui-draggable'){
            connectionValidity = false;
            alert("Invalid Connection");
        }
    }
    return connectionValidity;
});

// Update the model when a connection is established and bind events for the connection
jsPlumb.bind('connection' , function(connection){
    var target = connection.targetId;
    var targetId= target.substr(0, target.indexOf('-'));
    var targetClass = $('#'+targetId).attr('class');

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceClass = $('#'+sourceId).attr('class');

    var model;
    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable' || targetClass == 'wquerydrop ui-draggable'){
        if( sourceClass == 'streamdrop ui-draggable') {
            model = queryList.get(targetId);
            model.set('from', sourceId);
        }
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable' || sourceClass == 'wquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = queryList.get(sourceId);
            model.set('insert-into' , targetId);
        }
    }
    else if ( sourceClass == 'stquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = patternList.get(sourceId);
            model.set('insert-into' , targetId);
        }
    }
    else if ( targetClass == 'stquerydrop ui-draggable'){
        if(sourceClass == 'streamdrop ui-draggable'){
            model = patternList.get(targetId);
            var streams = model.get('from');
            if (streams== undefined){
                streams = [ sourceId]
            }
            else streams.push(sourceId);
            model.set('from', streams)
        }
    }

    else if ( sourceClass == 'joquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = joinQueryList.get(sourceId);
            model.set('insert-into', targetId);
        }
    }
    else if ( targetClass == 'joquerydrop ui-draggable'){
        if(sourceClass == 'streamdrop ui-draggable'){
            model = joinQueryList.get(targetId);
            var streams = model.get('from');
            if (streams== undefined){
                streams = [ sourceId]
            }
            else streams.push(sourceId);
            model.set('from', streams)
        }
    }
    var connectionObject = connection.connection;
    //add a overlay of a close icon for connection. connection can be detached by clicking on it
    connectionObject.addOverlay([
        "Custom", {
            create:function() {
                return $('<img src="../Images/Cancel.png" alt="">');
            },
            location :0.60,
            id:"close",
            events:{
                click:function() {
                    if (confirm('Are you sure you want to remove the connection?')) {
                        jsPlumb.detach(connectionObject);
                    } else {
                    }
                }
            }
        }
    ]);
    connectionObject.hideOverlay('close');
    //show the close icon when mouse is over the connection
    connectionObject.bind('mouseenter', function(conn) {
        conn.showOverlay('close');
    });
    //hide the close icon when the mouse is not on the connection path
    connectionObject.bind('mouseleave', function(conn) {
        conn.hideOverlay('close');
    });
});

// Update the model when a connection is detached
jsPlumb.bind('connectionDetached', function (connection) {

    var target = connection.targetId;
    var targetId= target.substr(0, target.indexOf('-'));
    var targetClass = $('#'+targetId).attr('class');

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceClass = $('#'+sourceId).attr('class');

    var model;
    var streams;
    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable' || targetClass == 'wquerydrop ui-draggable'){
        model = queryList.get(targetId);
        if (model != undefined){
            model.set('from' , '');
        }
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable' || sourceClass == 'wquerydrop ui-draggable'){
        model = queryList.get(sourceId);
        if (model != undefined){
            model.set('insert-into' , '');
        }
    }
    else if ( sourceClass == 'joquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = joinQueryList.get(sourceId);
            if (model != undefined){
                model.set('insert-into' , '');
            }
        }
    }
    else if ( targetClass == 'joquerydrop ui-draggable'){
        if(sourceClass == 'streamdrop ui-draggable'){
            model = joinQueryList.get(targetId);
            if (model != undefined){
                streams = model.get('from');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream,1);
                model.set('from', streams);
            }
        }
    }
    else if ( sourceClass == 'stquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = patternList.get(sourceId);
            if (model != undefined){
                model.set('insert-into' , '');
            }
        }
    }
    else if ( targetClass == 'stquerydrop ui-draggable'){
        if(sourceClass == 'streamdrop ui-draggable'){
            model = patternList.get(targetId);
            if (model != undefined){
                streams = model.get('from');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream,1);
                model.set('from', streams);
            }
        }
    }
});


/**
 * @function Auto align the diagram
 */
function autoAlign() {
    var g = new dagre.graphlib.Graph();
    g.setGraph({
        rankdir: 'LR',
        edgesep: 150,
        ranksep: 150,
        nodesep: 150
    });
    g.setDefaultEdgeLabel(function () {
        return {};
    });
    var nodes = document.getElementById("container").children;
    // var nodes = $(".ui-draggable");
    for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var nodeID = n.id ;
        g.setNode(nodeID, {width: 120, height: 80});
    }
    var edges = jsPlumb.getAllConnections();
    for (var i = 0; i < edges.length; i++) {
        var connection = edges[i];
        var target = connection.targetId;
        var source = connection.sourceId;
        var targetId= target.substr(0, target.indexOf('-'));
        var sourceId= source.substr(0, source.indexOf('-'));
        g.setEdge(sourceId, targetId);
    }
    // calculate the layout (i.e. node positions)
    dagre.layout(g);
    // Applying the calculated layout
    g.nodes().forEach(function (v) {
        $("#" + v).css("left", g.node(v).x + "px");
        $("#" + v).css("top", g.node(v).y + "px");
    });
    edges = edges.slice(0);
    for (var j = 0; j<edges.length ; j++){
        var source = edges[j].sourceId;
        var target = edges[j].targetId;
        jsPlumb.detach(edges[j]);
        jsPlumb.connect({
            source: source,
            target: target
        });

    }
}

/**
 * @function Bind event listeners for the elements that are dropped.
 */
function registerElementEventListeners(newElement){
    //register event listener to show configuration icons when mouse is over the element
    newElement.on( "mouseenter", function() {
        var element = $(this);
        element.find('.element-prop-icon').show();
        element.find('.element-conn-icon').show();
        element.find('.element-close-icon').show();
    });

    //register event listener to hide configuration icons when mouse is out from the element
    newElement.on( "mouseleave", function() {
        var element = $(this);
        element.find('.element-prop-icon').hide();
        element.find('.element-conn-icon').hide();
        element.find('.element-close-icon').hide();
    });

    //register event listener to remove the element when the close icon is clicked
    newElement.on('click', '.element-close-icon', function () {
        jsPlumb.remove(newElement);
    });
}

//------------------------------------------------Drop new elements on canvas-------------------------------------------

function dropStream(newAgent,i,top,left, name) {
    /*
     The node hosts a text node where the Stream's name input by the user will be held.
     Rather than simply having a `newAgent.text(streamName)` statement, as the text function tends to
     reposition the other appended elements with the length of the Stream name input by the user.
     */
    var node = document.createElement("div");
    node.id = i+"-nodeInitial";
    node.className = "streamNameNode";

    //Assign the Stream name input by the user to the textnode to be displayed on the dropped Stream
    var textnode = document.createTextNode(name);
    textnode.id = i+"-textnodeInitial";
    node.appendChild(textnode);

    /*
     prop --> When clicked on this icon, a definition and related information of the Stream Element will be displayed as an alert message
     showIcon --> An icon that elucidates whether the dropped stream element is an Import/Export/Defined stream (In this case: an Import arrow icon)
     conIcon --> Clicking this icon is supposed to toggle between showing and hiding the "Connection Anchor Points" (Not implemented)
     boxclose --> Icon to remove/delete an element
     */
    var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick ="generatePropertiesFormForStreams(this)">').attr('id', (i+'-propImportStream'));
    // var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="element-conn-icon collapse ">').attr('id', (i+'vis'));
    newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(prop);
    var finalElement = newAgent;

    /*
     connection --> The connection anchor point is appended to the element
     */
    var connection1 = $('<div class="connectorInStream">').attr('id', i+"-Indefined" ).addClass('connection');
    var connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outdefined" ).addClass('connection');



    finalElement.css({
        'top': top,
        'left': left
    });

    finalElement.append(connection1);
    finalElement.append(connection2);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });
    jsPlumb.makeTarget(connection1, {
        deleteEndpointsOnDetach:true,
        anchor: 'Left'
    });

    jsPlumb.makeSource(connection2, {
        deleteEndpointsOnDetach : true,
        anchor : 'Right'
    });

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
}

/**
 @function drop stream that is defined as the output stream in a query configuration
 * @param position   position of selected query
 * @param id    id of selected query
 * @param outStream     name for new output stream
 * @param streamAttributes      projections list for output stream
 */
function dropStreamFromQuery(position , id, outStream, streamAttributes) {
    var elementID = i;
    var newAgent = $('<div>').attr('id', elementID).addClass('streamdrop');

    //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
    $('#container').addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");
    $('#container').append(newAgent);

    //drop the stream
    dropStream(newAgent, i, position.top, position.left + 200, outStream);

    //add the new out stream to the stream collection
    var newStream = new app.Stream;
    newStream.set('id', elementID);
    newStream.set('define', outStream);
    newStream.set('type', 'define-stream');
    newStream.set('attributes', streamAttributes);
    streamList.add(newStream);
    //make the connection
    jsPlumb.connect({
        source: id+'-out',
        target: elementID+'-Indefined'
    });
    //update the query model with output stream
    var query = queryList.get(id);
    query.set('insert-into' , elementID);
    //increment the global variable i and the final element count
    finalElementCount = i;
    i++;
    registerElementEventListeners(newAgent);

}
/**
 * @function drop the query element on the canvas
 * @param newAgent
 * @param i
 * @param droptype
 * @param top
 * @param left
 * @param text
 */
function dropQuery(newAgent, i,droptype,top,left,text)
{
    /*A text node division will be appended to the newAgent element so that the element name can be changed in the text node and doesn't need to be appended...
     ...to the newAgent Element everytime theuser changes it*/
    var node = document.createElement("div");
    node.id = i+"-nodeInitial";
    node.className = "queryNameNode";
    var textnode = document.createTextNode(text);
    textnode.id = i+"-textnodeInitial";
    node.appendChild(textnode);

    if( droptype=='squerydrop' || droptype =='wquerydrop' || droptype == 'filterdrop'){
        var newQuery = new app.Query;
        newQuery.set('id', i);
        queryList.add(newQuery);
        var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForQueries(this)">').attr('id', (i+('-prop')));
        // var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)"> ').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(prop);
        dropSimpleQueryElement(newAgent,i,top,left);
    }

    else if(droptype=="joquerydrop")
    {
        var newJoinQuery = new app.JoinQuery;
        newJoinQuery.set('id', i);
        joinQueryList.add(newJoinQuery);
        var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForJoinQuery(this)">').attr('id', (i+('-propjoquerydrop')));
        // var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)" >').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(prop);
        dropCompleteJoinQueryElement(newAgent,i,top,left);
    }
    else if(droptype=="stquerydrop")
    {
        var newPattern = new app.Pattern;
        newPattern.set('id', i);
        patternList.add(newPattern);
        var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForPattern(this)">').attr('id', (i+('-propstquerydrop')));
        // var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)">').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(prop);
        dropPatternQueryElement(newAgent,i,top,left);
    }
}


/**
 * @function drop the simple query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param top
 * @param left
 * @description allows single input stream and single output stream
 */
function dropSimpleQueryElement(newAgent, i, top, left)
{
    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': top,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left',
        maxConnections : 1,
        deleteEndpointsOnDetach:true
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        uniqueEndpoint: true,
        maxConnections : 1,
        deleteEndpointsOnDetach:true
    });

}

/**
 * @function drop the pattern query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param top
 * @param left
 * @description allows mulitple input streams and single output stream
 *
 */

function dropPatternQueryElement(newAgent, i,top, left)
{
    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': top,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left'
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1
    });
}

function dropCompleteJoinQueryElement(newAgent,i, top,left)
{

    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': top,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Left',
        maxConnections:2
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        uniqueEndpoint: true,
        maxConnections: 1
    });

}
// ------------------------------------Drop elements ends------------------------------------

/**
 * @function Drop a window stream on the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param topP
 * @param left
 * @param asName
 */

function dropWindowStream(newAgent, i,topP,left,asName)
{
    /*
     The node hosts a text node where the Window's name, input by the user will be held.
     Rather than simply having a `newAgent.text(windowName)` statement, as the text function tends to
     reposition the other appended elements with the length of the Stream name input by the user.
     */
    var windowNode = document.createElement("div");
    windowNode.id = i+"-windowNode";
    windowNode.className = "windowNameNode";
    var windowTextnode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    windowTextnode.id = i+"-windowTextnode";
    windowNode.appendChild(windowTextnode);

    var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="getConnectionDetailsForWindow(this)">').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)">').attr('id', (i+'vis'));
    newAgent.append(windowNode).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(conIcon).append(prop);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorInWindow">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOutWindow">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    finalElement.append(connectionOut);

    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Continuous',
        maxConnections:1
    });
    // jsPlumb.makeTarget(connectionOut, {
    //     anchor: 'Continuous'
    // });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Continuous'
    });

}


/**
 * @description Method that appends the prop to a partition element and calls the method to drop the partition onto the canvas
 * @param newAgent
 * @param i
 * @param droptype
 * @param mouseTop
 * @param mouseLeft
 */

function dropPartition(newAgent, i,mouseTop,mouseLeft)
{
    var prop = $('<a><img src="../Images/settings.png" class="element-prop-icon " onclick =""></a>').attr('id', (i+('-propPartition')));
    newAgent.append('<img src="../Images/Cancel.png" class="element-close-icon " id="boxclose">').append(prop);
    dropCompletePartitionElement(newAgent,i,mouseTop,mouseLeft);

}

function dropCompletePartitionElement(newAgent,i,mouseTop,mouseLeft)
{

    // $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    $(finalElement).draggable({
        containment: "container",
        drag:function(e){
            $(this).find('._jsPlumb_endpoint_anchor_').each(function(i,e){
                if($(e).hasClass("connect"))
                    jsPlumb.repaint($(e).parent());
                else
                    jsPlumb.repaint($(e));
            });
        }
    }).resizable();
    var x =1;
    $(finalElement).on('dblclick',function () {

        var connectionIn = $('<div class="connectorInPart" >').attr('id', i + '-pc'+ x).addClass('connection');
        finalElement.append(connectionIn);

        // jsPlumb.addEndpoint(connectionIn, {
        //     isTarget: true,
        //     isSource: true
        // });
        // jsPlumb.addGroup({
        //     el:"id",
        //     id:"aGroup"
        // });
        jsPlumb.draggable(finalElement, {
            containment: 'parent'
        });
        jsPlumb.makeTarget(connectionIn, {
            anchor: 'Top'
        });
        jsPlumb.makeSource(connectionIn, {
            anchor: 'Top'
        });

        x++;
    });

    finalElement.css({
        'top': mouseTop,
        'left': mouseLeft
    });

    // $(function() { $(finalElement).draggable().resizable(); });

    $('#container').append(finalElement);

    // $(finalElement).resizable({
    //     resize: function (e, ui) {
    //         jsPlumb.repaint(ui.helper);
    //     }
    // });

}




