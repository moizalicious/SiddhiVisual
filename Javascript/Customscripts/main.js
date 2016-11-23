// i --> newAgent ID (Dropped Element ID)
var i = 1;

//droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
var droptype;

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
     * @function draggable method for the 'import stream' tool
     * @helper clone
     */


    $(".stream").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'window' tool
     * @helper clone
     */

    $(".wstream").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Pass through query' tool
     * @helper clone
     */

    $(".squery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'Filter query' tool
     * @helper clone
     */
    $(".filter").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    /**
     * @function draggable method for the 'windows query' tool
     * @helper clone
     */
    $(".wquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'Join query' tool
     * @helper clone
     */

    $(".joquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'state-machine query' tool
     * @helper clone
     */

    $(".stquery").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true

    });

    /**
     * @function draggable method for the 'Partition' tool
     * @helper clone
     */

    $(".partition").draggable
    ({
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
                dropWindowStream(newAgent, i, e,mouseTop,mouseLeft,"Window");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Pass through Query then->
            else if (dropElem == "squery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('squerydrop ');
                droptype = "squerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, e,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Filter query then->
            else if (dropElem == "filter ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('filterdrop ');
                droptype = "filterdrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, e,droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Window Query then->
            else if (dropElem == "wquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('wquerydrop ');
                droptype = "wquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Join Query then->
            else if (dropElem == "joquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('joquerydrop');
                droptype = "joquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a State machine Query(Pattern and Sequence) then->
            else if(dropElem == "stquery ui-draggable") {
                newAgent = $('<div>').attr('id', i).addClass('stquerydrop');
                droptype = "stquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, e, droptype,mouseTop,mouseLeft,"Empty Query");
                finalElementCount=i;
                i++;
            }

            //If the dropped Element is a Partition then->
            else{
                newAgent = $('<div>').attr('id', i).addClass('partitiondrop');
                droptype = "partitiondrop";
                $(droppedElement).draggable({containment: "container"});
                //Drop the element instantly since its projections will be set only when the user requires it
                dropPartition(newAgent,i,e,droptype,mouseTop,mouseLeft);
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

    if( targetClass == 'squerydrop ui-draggable' || targetClass == 'filterdrop ui-draggable'
        || targetClass == 'wquerydrop ui-draggable' || targetClass == 'stquerydrop ui-draggable') {
        if (sourceClass != 'streamdrop ui-draggable') {
            connectionValidity = false;
            alert("Invalid Connection");
        }
    }
    else if( sourceClass == 'squerydrop ui-draggable' || sourceClass == 'filterdrop ui-draggable'
        || sourceClass == 'wquerydrop ui-draggable' || sourceClass == 'stquerydrop ui-draggable'){
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
            model.set('into' , targetId);
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
    else if ( sourceClass == 'stquerydrop ui-draggable'){
        if(targetClass == 'streamdrop ui-draggable'){
            model = patternList.get(sourceId);
            if (model != undefined){
                model.set('into' , '');
            }
        }
    }
    else if ( targetClass == 'stquerydrop ui-draggable'){
        if(sourceClass == 'streamdrop ui-draggable'){
            model = patternList.get(targetId);
            if (model != undefined){
                var streams = model.get('from');
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
        rankDir : 'LR',
        edgesep : 200
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
/*
   Drop new elements on canvas
 */

/**
 * @function drop the query element on the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param droptype
 * @param topP
 * @param left
 * @param text
 */
function dropQuery(newAgent, i,e,droptype,topP,left,text)
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
        var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)"> ').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(conIcon).append(prop);
        dropSimpleQueryElement(newAgent,i,e,topP,left);
    }

    else if(droptype=="joquerydrop")
    {
        var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="getJoinConnectionDetails(this)">').attr('id', (i+('-propjoquerydrop')));
        var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)" >').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(conIcon).append(prop);
        dropCompleteJoinQueryElement(newAgent,i,e,topP,left);
    }
    else if(droptype=="stquerydrop")
    {
        var newPattern = new app.Pattern;
        newPattern.set('id', i);
        patternList.add(newPattern);
        var prop = $('<img src="../Images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForPattern(this)">').attr('id', (i+('-propstquerydrop')));
        var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon collapse" onclick="connectionShowHideToggle(this)">').attr('id', (i+'vis'));
        newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(conIcon).append(prop);
        dropPatternQueryElement(newAgent,i,e,topP,left);
    }
}


/**
 * @function drop the simple query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param e
 * @param topP
 * @param left
 * @description allows single input stream and single output stream
 */
function dropSimpleQueryElement(newAgent, i, e, topP, left)
{
    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

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
        anchor: 'Left',
        maxConnections:1,
        deleteEndpointsOnDetach:true
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1,
        deleteEndpointsOnDetach:true
    });

}

/**
 * @function drop the patttern query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param e
 * @description allows mulitple input streams and single output stream
 *
 */

function dropPatternQueryElement(newAgent, i, e, topP, left)
{
    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

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
        anchor: 'Left'
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1
    });
}
// ------------------------------------Drop elements ends------------------------------------

/**
 *
 * @function detect the id of the element clicked
 * @param sender
 * @returns {*}
 *
 */
function doclick(sender)
{
    var arr = sender.id.match(/-prop(.*)/);  //By matching with the following pattern, the Element Type(Import, Export/ Defined Stream) is extracted and stored in variable `arr`
    if (arr != null) {
        droptype = arr[1];
    }

    var clickedelemId=sender.id;
    clickedelemId = clickedelemId.charAt(0);    //clickedelemId --> Gets the Element ID separately from the sender's ID as the `sender` will be the prop icon and not the element itself

    if(droptype == "ImportStream")
    {
        var selectedStreamim = createdImportStreamArray[clickedelemId-1][1];
        var streamnam = createdImportStreamArray[clickedelemId-1][2];
        var streamDefget;
        if (selectedStreamim == "Stream1")
        {
            streamDefget=streamDef[0][3];
            var res = streamDefget.replace("Stream1", streamnam);
        }
        else if(selectedStreamim=="Stream2")
        {
            streamDefget=streamDef[1][3];
            var res = streamDefget.replace("Stream2", streamnam);
        }
        else
        {
            streamDefget=streamDef[2][3];
            var res = streamDefget.replace("Stream3", streamnam);
        }
        alert("Stream ID: "+clickedelemId+"\nSelected stream: "+ createdImportStreamArray[clickedelemId-1][1]+"\nStream Type: Import Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
    else if (droptype == "ExportStream")
    {
        var selectedStreamim = createdExportStreamArray[clickedelemId-1][1];
        var streamnam = createdExportStreamArray[clickedelemId-1][2];
        var streamDefy;
        if (selectedStreamim == "Stream1")
        {
            streamDefy=streamDef[0][3];
            var res = streamDefy.replace("Stream1", streamnam);
        }
        else if(selectedStreamim=="Stream2")
        {
            streamDefy=streamDef[1][3];
            var res = streamDefy.replace("Stream2", streamnam);
        }
        else
        {
            streamDefy=streamDef[2][3];
            var res = streamDefy.replace("Stream3", streamnam);
        }
        alert("Stream ID: "+clickedelemId+"\nSelected stream: "+ createdExportStreamArray[clickedelemId-1][1]+"\nStream Type: Export Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
    else if(droptype == "DefinedStream")
    {
        var streamname = createdDefinedStreamArray[clickedelemId][1];
        var attrnum = createdDefinedStreamArray[clickedelemId][4];
        var tblerows = attrnum-1;
        var res = "define stream "+ streamname + "(";


        for( var t=0; t<tblerows; t++)
        {
            for (var y=0; y<2 ;y++)
            {
                res=res+ createdDefinedStreamArray[clickedelemId][2][t][y] + " ";
            }
            if(t==tblerows-1)
            {
                res=res+"";
            }
            else
            {
                res=res+", ";
            }

        }
        res=res+")";
        alert("Stream ID: "+clickedelemId+"\nCreated stream: "+ streamname+"\nStream Type: Defined Stream\nStream Definition: "+res);
        clickedId= clickedelemId;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                            WINDOW(STREAM) ELEMENT RELATED FUNCTIONALITIES                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Drop a window stream on the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param topP
 * @param left
 * @param asName
 */

function dropWindowStream(newAgent, i, e,topP,left,asName)
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Get the ID of the connected "from-stream"
 * @param element
 */

function getConnectionDetailsForWindow(element)
{
    var fromStreamIdForWindow;
    var clickedId =  element.id;
    var elementIdentity= element.id;
    var elementID=clickedId = clickedId.charAt(0); //Extract the window element's ID from the prop's ID

    /*
     The window has two connection achor points
     1. in
     2. out
     - If the Window is not connected(i.e. derived from a stream that has already been dropped on the container,
     a form to define the window will be shown.
     - If the Window is connected to a stream, the connected stream details will be gathered and only a name for the window
     needs to be specified.
     */
    clickedId = clickedId+"-in";
    var con=jsPlumb.getAllConnections();
    var list=[];
    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            list[i] = new Array(2);
            list[i][0] = con[i].sourceId;
            fromStreamIdForWindow =list[i][0];
            list[i][1] = con[i].targetId;
        }
    }
    if(fromStreamIdForWindow==undefined || fromStreamIdForWindow==null) /* No streams are connected to the in-connector anchor point of the window*/
    {
        createWindowDefinitionForm(elementIdentity);    /* Define a new window with user-input attributess and types*/
    }
    else
    {
        //Window derived from a stream
        fromStreamIdForWindow = fromStreamIdForWindow.charAt(0);
        getFromStreamNameForWindow(fromStreamIdForWindow,elementID);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Display form to define a new window
 * @param i
 */

function createWindowDefinitionForm(i)
{
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tableWindowStreamForm = document.createElement('table');    //To display the projections defined for the window
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    /*---------Window Form Element Definitions-----------*/

    DefwindowStreamDiv=document.createElement("div");
    DefwindowStreamDiv.className="DefwindowStreamDiv";
    DefwindowStreamDiv.id="DefwindowStreamDiv";

    DefWindowAttrTableDiv=document.createElement("div");
    DefWindowAttrTableDiv.className="DefWindowAttrTableDiv";
    DefWindowAttrTableDiv.id="DefWindowAttrTableDiv";

    DefWindowAttrDiv=document.createElement("div");
    DefWindowAttrDiv.className="DefWindowAttrDiv";
    DefWindowAttrDiv.id="DefWindowAttrDiv";

    DefwindowStreamLabel= document.createElement("label");
    DefwindowStreamLabel.className="DefwindowStreamLabel";
    DefwindowStreamLabel.id="DefwindowStreamLabel";
    DefwindowStreamLabel.innerHTML='Define Window';

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    DefForWindowLabel= document.createElement("label");
    DefForWindowLabel.id ="DefForWindowLabel";
    DefForWindowLabel.className ="DefForWindowLabel";
    DefForWindowLabel.innerHTML = "Window Name: ";

    DefNameForWindow= document.createElement("input");
    DefNameForWindow.id ="DefNameForWindow";
    DefNameForWindow.className ="DefNameForWindow";

    DefAddAttributes=document.createElement("button");
    DefAddAttributes.type="button";
    DefAddAttributes.className="DefAddAttributes";
    DefAddAttributes.id="DefAddAttributes";
    DefAddAttributes.innerHTML="Add Atribute";
    DefAddAttributes.onclick = function () {
        addAttributeForWindow();    /* Open the form to add projections to the Window */
    };

    DefCreateWindow=document.createElement("button");
    DefCreateWindow.type="button";
    DefCreateWindow.className="DefCreateWindow";
    DefCreateWindow.id="DefCreateWindow";
    DefCreateWindow.innerHTML="Create Window";
    DefCreateWindow.onclick = function () {
        CreateWindow(i);
    };

    WindowStreamCloseButton=document.createElement("button");
    WindowStreamCloseButton.type="button";
    WindowStreamCloseButton.className="partitionCloseButton";
    WindowStreamCloseButton.id="partitionCloseButton";
    WindowStreamCloseButton.innerHTML="Cancel";
    WindowStreamCloseButton.onclick = function()
    {
        $("#tableWindowStreamForm tr").remove();
        $("#DefWindowAttrDiv").removeClass("disabledbutton");
        closeForm();
    };


    // Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');

    td1.appendChild(DefwindowStreamLabel);
    tr1.appendChild(td1);
    tableWindowStreamForm.appendChild(tr1);

    // Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(DefForWindowLabel);
    tr2.appendChild(td2);
    td3.appendChild(DefNameForWindow);
    tr2.appendChild(td3);
    tableWindowStreamForm.appendChild(tr2);

    // Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');
    var td5=document.createElement('td');

    td4.appendChild(EmptyLabel);
    tr3.appendChild(td4);
    td5.appendChild(DefAddAttributes);
    tr3.appendChild(td5);
    tableWindowStreamForm.appendChild(tr3);

    DefwindowStreamDiv.appendChild(tableWindowStreamForm);
    DefwindowStreamDiv.appendChild(DefWindowAttrTableDiv);
    DefwindowStreamDiv.appendChild(WindowStreamCloseButton);

    lot.appendChild(DefwindowStreamDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Form to create multiple attribute and type specifications as the user wishes.
 */

function addAttributeForWindow()
{
    DefWindowAttrDiv=document.createElement("div");
    DefWindowAttrDiv.className="DefWindowAttrDiv";
    DefWindowAttrDiv.id="DefWindowAttrDiv";

    var tableWindowStreamForm = document.createElement('table');
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    DefWindowAttrTypeComboDiv=document.createElement("div");
    DefWindowAttrTypeComboDiv.className="DefWindowAttrTypeComboDiv";
    DefWindowAttrTypeComboDiv.id="DefWindowAttrTypeComboDiv";

    DefForWindowAttrLabel= document.createElement("label");
    DefForWindowAttrLabel.id ="DefForWindowAttrLabel";
    DefForWindowAttrLabel.className ="DefForWindowAttrLabel";
    DefForWindowAttrLabel.innerHTML = "Attribute Name: ";

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    DefForWindowAttrInput= document.createElement("input");
    DefForWindowAttrInput.id ="DefForWindowAttrInput";
    DefForWindowAttrInput.className ="DefForWindowAttrInput";

    DefForWindowAttrTypeLabel= document.createElement("label");
    DefForWindowAttrTypeLabel.id ="DefForWindowAttrTypeLabel";
    DefForWindowAttrTypeLabel.className ="DefForWindowAttrTypeLabel";
    DefForWindowAttrTypeLabel.innerHTML = "Attribute Type: ";


    //Generate a combo box to display the attribute types
    var html = '<select id="attrTypeComboForWindow">', attrtypes = typeGenerate(), i;
    for(i = 0; i < attrtypes.length; i++) {
        html += "<option value='"+attrtypes[i]+"'>"+attrtypes[i]+"</option>";
    }
    html += '</select>';

    DefWindowAttrTypeComboDiv.innerHTML = html;

    DefAddAttributesToTablebtn=document.createElement("button");
    DefAddAttributesToTablebtn.type="button";
    DefAddAttributesToTablebtn.className="DefAddAttributesToTablebtn";
    DefAddAttributesToTablebtn.id="DefAddAttributesToTablebtn";
    DefAddAttributesToTablebtn.innerHTML="Add";
    DefAddAttributesToTablebtn.onclick = function () {
        showAttributesForWindowInTable();
    };

    // Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');

    td1.appendChild(DefForWindowAttrLabel);
    tr1.appendChild(td1);
    td2.appendChild(DefForWindowAttrInput);
    tr1.appendChild(td2);
    tableWindowStreamForm.appendChild(tr1);

    // Row 2

    var tr2 = document.createElement('tr');
    var td3=document.createElement('td');
    var td4=document.createElement('td');

    td3.appendChild(DefForWindowAttrTypeLabel);
    tr2.appendChild(td3);
    td4.appendChild(DefWindowAttrTypeComboDiv);
    tr2.appendChild(td4);
    tableWindowStreamForm.appendChild(tr2);

    // Row 3

    var tr3 = document.createElement('tr');
    var td5=document.createElement('td');
    var td6=document.createElement('td');

    td5.appendChild(EmptyLabel);
    tr3.appendChild(td5);
    td6.appendChild(DefAddAttributesToTablebtn);
    tr3.appendChild(td6);
    tableWindowStreamForm.appendChild(tr3);

    DefWindowAttrDiv.appendChild(tableWindowStreamForm);
    DefwindowStreamDiv.appendChild(DefWindowAttrDiv);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Generate attribute types for the combobox
 * @returns {Array}
 */

function typeGenerate() {
    var typeArray = [];
    typeArray[0] = "int";
    typeArray[1] = "long";
    typeArray[2] = "double";
    typeArray[3] = "float";
    typeArray[4] = "string";
    typeArray[5] = "bool";
    return typeArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var attrName1 = document.createElement("label");
var attrType1= document.createElement("label");
var closeattr1= document.createElement("button");

var table1 = document.createElement('table');
table1.id = "attrtableForWindow";
table1.className = "attrtableForWindow";
var tr = document.createElement('tr');
var attrNameHeader= document.createElement('td');
var attrtypeHeader = document.createElement('td');
var attrDeleteHeader   = document.createElement('td');
attrNameHeader.innerHTML = "Attribute Name";
attrtypeHeader.innerHTML = "Attribute Type";
attrDeleteHeader.innerHTML = "Delete Row";
tr.appendChild(attrNameHeader);
tr.appendChild(attrtypeHeader);
tr.appendChild(attrDeleteHeader);
table1.appendChild(tr);

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/

/**
 * @function Append Added projections to the display table
 */

function showAttributesForWindowInTable()
{
    var tr = document.createElement('tr');
    var attributeName = document.getElementById("DefForWindowAttrInput").value;
    var choice=document.getElementById("attrTypeComboForWindow");
    var attrTypeCombo = choice.options[choice.selectedIndex].text;

    DefWindowAttrTableDiv.appendChild(attrName1);
    DefWindowAttrTableDiv.appendChild(attrType1);
    DefWindowAttrTableDiv.appendChild(closeattr1);

    var tdAttrName = document.createElement('td');
    var tdAttrType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var text1 = document.createTextNode(attributeName);
    var text2 = document.createTextNode(attrTypeCombo);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    deletebtn.innerHTML = "<img src='../Images/Delete.png'>";
    deletebtn.onclick = function() {
        deleteRowForWindow(this);
    };

    tdAttrName.appendChild(text1);
    tdAttrType.appendChild(text2);
    tdDelete.appendChild(deletebtn);
    tr.appendChild(tdAttrName);
    tr.appendChild(tdAttrType);
    tr.appendChild(tdDelete);
    table1.appendChild(tr);
    DefWindowAttrTableDiv.appendChild(table1);

    DefwindowStreamDiv.appendChild(DefCreateWindow);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table of the window form in defining a new window
 * @param row
 */

function deleteRowForWindow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('attrtableForWindow').deleteRow(i);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var queryDiv;
var simpleQueryLabel, simpleQueryName,queryNameInput, fromStreamLabel, fromStream, filterLabel,filterInput, selectLabel, insertIntoLabel, insertIntoStream;
var inputtxtName;
var inputlblName;
var queryFomButton;
/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/

/**
 * @function Create the query form for Pass-through and Filter queries.
 * @param elementID
 * @param fromNameSt
 * @param intoNameSt
 * @param fromStreamIndex
 * @param intoStreamIndex
 * @param streamType
 * @param defAttrNum
 * @param formHeading
 */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/
var attrName = document.createElement("label");
var attrType= document.createElement("label");
var closeattr= document.createElement("button");

var table = document.createElement('table');
table.id = "attrtable";
table.className = "attrtable";
var tr = document.createElement('tr');
var attrNameHeader= document.createElement('td');
var attrtypeHeader = document.createElement('td');
var attrDeleteHeader   = document.createElement('td');
attrNameHeader.innerHTML = "Attribute Name";
attrtypeHeader.innerHTML = "Attribute Type";
attrDeleteHeader.innerHTML = "Delete Row";
tr.appendChild(attrNameHeader);
tr.appendChild(attrtypeHeader);
tr.appendChild(attrDeleteHeader);
table.appendChild(tr);
/*--------------------Global Variables needed for the Window Attributes Table--------------------------------*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRow(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('attrtable').deleteRow(i);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRowForVariablePartition(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('tableVariablePartitionConditionDisplay').deleteRow(i);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function Delete a row from the table
 * @param row
 */
function deleteRowForRangePartition(row)
{
    var i=row.parentNode.parentNode.rowIndex;
    document.getElementById('tableRangePartitionConditionDisplay').deleteRow(i);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function connectionShowHideToggle(element)
{
    var clickedId =  element.id;
    var elementID=clickedId = clickedId.charAt(0);
    var ImportCon = elementID+"-Inimport";
    var ImportCon1 = elementID+"-Outimport";
    var ExportCon = elementID+"-Inexport";
    var ExportCon1 = elementID+"-Outexport";
    var DefinedCon = elementID+"-Indefined";
    var DefinedCon1 = elementID+"-Outdefined";

    var importConExists = document.getElementById(ImportCon);
    var importConExists1 = document.getElementById(ImportCon1);
    //alert(importConExists);
    var exportConExists = document.getElementById(ExportCon);
    var exportConExists1 = document.getElementById(ExportCon1);
    //alert(exportConExists);
    var definedConExists = document.getElementById(DefinedCon);
    var definedConExists1 = document.getElementById(DefinedCon1);
    //alert(definedConExists);

    if(importConExists != null || importConExists1 !=null)
    {
        if(importConExists+ $(':visible').length)
        {
            $(importConExists).hide();
        }
        else
        {
            $(importConExists).show();
        }

    }

    else if(exportConExists != null || exportConExists1 != null)
    {
        if(exportConExists+ $(':visible').length)
        {
            $(exportConExists).hide();
        }
        else
        {
            $(exportConExists).show();
        }

    }

    else if(definedConExists != null || definedConExists1 != null)
    {
        if(definedConExists+ $(':visible').length)
        {
            $(definedConExists).hide();
        }

        else
        {
            $(definedConExists).show();
        }

    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Method that appends the prop to a partition element and calls the method to drop the partition onto the canvas
 * @param newAgent
 * @param i
 * @param e
 * @param droptype
 */

function dropPartition(newAgent, i, e, droptype,mouseTop,mouseLeft)
{

    var prop = $('<a><b><img src="../Images/settings.png" class="querySettingIconLoc"></b></a>').attr('id', (i+('-propPartition')));
    newAgent.append('<a class="boxclose1" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(prop);
    dropCompletePartitionElement(newAgent,i,e,mouseTop,mouseLeft);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description
 * @param newAgent
 * @param i
 * @param e
 */
var x =1;

function dropCompletePartitionElement(newAgent,i,e,mouseTop,mouseLeft)
{

    // $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    $(finalElement).on('dblclick',function () {

        var connectionIn = $('<div class="connectorInPart" onclick="getPartitionConnectionDetails(this.id)">').attr('id', i + '-pc'+ x).addClass('connection').text("pc"+x);
        finalElement.append(connectionIn);

        jsPlumb.makeTarget(connectionIn, {
            anchor: 'Left'
        });
        jsPlumb.makeSource(connectionIn, {
            anchor: 'Right'
        });

        x++;
    });

    finalElement.css({
        'top': mouseTop,
        'left': mouseLeft
    });

    $(function() { $(finalElement).draggable().resizable(); });
    $('#container').append(finalElement);

    // $(finalElement).resizable({
    //     resize: function (e, ui) {
    //         jsPlumb.repaint(ui.helper);
    //     }
    // });

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO Json output for Partitions-> Hence regenerating a partition from input

var tablePartitionConditionTableForm = document.createElement('table');
tablePartitionConditionTableForm.id = "tablePartitionConditionTableForm";
tablePartitionConditionTableForm.className = "tablePartitionConditionTableForm";

function setPartitionConditionform(clickedId,selctedSt,fromStreamName,streamType,fromStreamIndex, defAttrNum, type)
{
    // alert("called");

    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tablePartitionConditionForm = document.createElement('table');
    tablePartitionConditionForm.id = "tablePartitionConditionForm";
    tablePartitionConditionForm.className = "tablePartitionConditionForm";

    var tableVariablePartitionConditionForm = document.createElement('table');
    tableVariablePartitionConditionForm.id = "tableVariablePartitionConditionForm";
    tableVariablePartitionConditionForm.className = "tableVariablePartitionConditionForm";

    var tableRangePartitionConditionForm = document.createElement('table');
    tableRangePartitionConditionForm.id = "tableRangePartitionConditionForm";
    tableRangePartitionConditionForm.className = "tableRangePartitionConditionForm";

    partitionConditionDiv=document.createElement("div");
    partitionConditionDiv.className="partitionConditionDiv";
    partitionConditionDiv.id="partitionConditionDiv";

    variablePartitionTypeTableDiv=document.createElement("div");
    variablePartitionTypeTableDiv.className="partitionTypeTableDiv";
    variablePartitionTypeTableDiv.id="partitionTypeTableDiv";

    variablePartitionTypeTableDisplayDiv=document.createElement("div");
    variablePartitionTypeTableDisplayDiv.className="variablePartitionTypeTableDisplayDiv";
    variablePartitionTypeTableDisplayDiv.id="variablePartitionTypeTableDisplayDiv";

    rangePartitionTypeTableDiv=document.createElement("div");
    rangePartitionTypeTableDiv.className="rangePartitionTypeTableDiv";
    rangePartitionTypeTableDiv.id="rangePartitionTypeTableDiv";

    rangePartitionTypeTableDisplayDiv=document.createElement("div");
    rangePartitionTypeTableDisplayDiv.className="rangePartitionTypeTableDisplayDiv";
    rangePartitionTypeTableDisplayDiv.id="rangePartitionTypeTableDisplayDiv";

    partitionConditionLabel= document.createElement("label");
    partitionConditionLabel.className="partitionConditionLabel";
    partitionConditionLabel.id="partitionConditionLabel";
    partitionConditionLabel.innerHTML='Define Partition Condition';

    variablePartitionIdLabel= document.createElement("label");
    variablePartitionIdLabel.id ="variablePartitionIdLabel";
    variablePartitionIdLabel.className ="variablePartitionIdLabel";
    variablePartitionIdLabel.innerHTML = "Variable Partitioning";

    rangePartitionIdLabel= document.createElement("label");
    rangePartitionIdLabel.id ="rangePartitionIdLabel";
    rangePartitionIdLabel.className ="rangePartitionIdLabel";
    rangePartitionIdLabel.innerHTML = "Range Partitioning";

    rangePartitionTypeInput = document.createElement("input");
    rangePartitionTypeInput.id ="rangePartitionTypeInput";
    rangePartitionTypeInput.className ="rangePartitionTypeInput";

    EmptyLabel= document.createElement("label");
    EmptyLabel.id ="EmptyLabel";
    EmptyLabel.className ="EmptyLabel";
    EmptyLabel.innerHTML = "";

    partitionIdLabel= document.createElement("label");
    partitionIdLabel.id ="partitionIdLabel";
    partitionIdLabel.className ="partitionIdLabel";
    partitionIdLabel.innerHTML = "Partition ID: ";

    partitionIdInput= document.createElement("input");
    partitionIdInput.id ="partitionIdInput";
    partitionIdInput.className ="partitionIdInput";

    rangePartitionTypeLabel= document.createElement("label");
    rangePartitionTypeLabel.id ="rangePartitionTypeLabel";
    rangePartitionTypeLabel.className ="rangePartitionTypeLabel";
    rangePartitionTypeLabel.innerHTML = "Range Partition Type: ";

    variablePartitionTypeLabel= document.createElement("label");
    variablePartitionTypeLabel.id ="variablePartitionTypeLabel";
    variablePartitionTypeLabel.className ="variablePartitionTypeLabel";
    variablePartitionTypeLabel.innerHTML = "Varibale Partition Type: ";

    partitionTypeComboDiv=document.createElement("div");
    partitionTypeComboDiv.className="partitionTypeComboDiv";
    partitionTypeComboDiv.id="partitionTypeComboDiv";

    var html = '<select id="partitionTypeComboForPartition">', attrtypes = partitiontypeGenerate(streamType,selctedSt,fromStreamIndex,defAttrNum, type), i;
    for(i = 0; i < attrtypes.length; i++) {
        html += "<option value='"+attrtypes[i]+"'>"+attrtypes[i]+"</option>";
    }
    html += '</select>';

    partitionTypeComboDiv.innerHTML = html;

    btnAddVariablePartitionType=document.createElement("button");
    btnAddVariablePartitionType.type="button";
    btnAddVariablePartitionType.className="btnAddVariablePartitionType";
    btnAddVariablePartitionType.id="btnAddVariablePartitionType";
    btnAddVariablePartitionType.innerHTML="Add variable partition type";
    btnAddVariablePartitionType.onclick = function () {
        $("#rangePartitionTypeTableDiv").addClass("disabledbutton");
        addVariablePartitionTypeToTable();
    };

    btnAddRangePartitionType=document.createElement("button");
    btnAddRangePartitionType.type="button";
    btnAddRangePartitionType.className="btnAddRangePartitionType";
    btnAddRangePartitionType.id="btnAddRangePartitionType";
    btnAddRangePartitionType.innerHTML="Add range partition type";
    btnAddRangePartitionType.onclick = function () {
        $("#partitionTypeTableDiv").addClass("disabledbutton");
        addRangePartitionTypeToTable();
    };

    btnPartitionCondition=document.createElement("button");
    btnPartitionCondition.type="button";
    btnPartitionCondition.className="btnPartitionCondition";
    btnPartitionCondition.id="btnPartitionCondition";
    btnPartitionCondition.innerHTML="Apply Partition Condition";
    btnPartitionCondition.onclick = function () {
        savePartitionDetailsToStream(clickedId,streamType,fromStreamIndex,fromStreamName);
    };

    partitionCloseButton=document.createElement("button");
    partitionCloseButton.type="button";
    partitionCloseButton.className="partitionCloseButton";
    partitionCloseButton.id="partitionCloseButton";
    partitionCloseButton.innerHTML="Cancel";
    partitionCloseButton.onclick = function() {
        $("#tableVariablePartitionConditionDisplay tr").remove();
        $("#tableRangePartitionConditionDisplay tr").remove();
        $("#rangePartitionTypeTableDiv").removeClass("disabledbutton");
        $("#rangePartitionTypeTableDiv").addClass("disabledbutton");
        closeForm();
    };

    //Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');

    td1.appendChild(partitionConditionLabel);
    tr1.appendChild(td1);
    tablePartitionConditionForm.appendChild(tr1);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(partitionIdLabel);
    tr2.appendChild(td2);
    td3.appendChild(partitionIdInput);
    tr2.appendChild(td3);
    tablePartitionConditionForm.appendChild(tr2);

    partitionConditionDiv.appendChild(tablePartitionConditionForm);

    ////////////////////////Variable Partitioning Division Specs///////////////////

    variablePartitionTypeTableDiv.appendChild(variablePartitionIdLabel);
    variablePartitionTypeTableDiv.appendChild(variablePartitionTypeTableDisplayDiv);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(variablePartitionTypeLabel);
    tr2.appendChild(td2);
    td3.appendChild(partitionTypeComboDiv);
    tr2.appendChild(td3);
    tableVariablePartitionConditionForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');

    td4.appendChild(btnAddVariablePartitionType);
    tr3.appendChild(td4);
    tableVariablePartitionConditionForm.appendChild(tr3);

    variablePartitionTypeTableDiv.appendChild(tableVariablePartitionConditionForm);
    partitionConditionDiv.appendChild(variablePartitionTypeTableDiv);
    $(".variablePartitionTypeTableDisplayDiv").hide();

    ////////////////////////Range Partitioning Division Specs///////////////////

    rangePartitionTypeTableDiv.appendChild(rangePartitionIdLabel);
    rangePartitionTypeTableDiv.appendChild(rangePartitionTypeTableDisplayDiv);

    //Row 2

    var tr2 = document.createElement('tr');
    var td2=document.createElement('td');
    var td3=document.createElement('td');

    td2.appendChild(rangePartitionTypeLabel);
    tr2.appendChild(td2);
    td3.appendChild(rangePartitionTypeInput);
    tr2.appendChild(td3);
    tableRangePartitionConditionForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td4=document.createElement('td');

    td4.appendChild(btnAddRangePartitionType);
    tr3.appendChild(td4);
    tableRangePartitionConditionForm.appendChild(tr3);

    rangePartitionTypeTableDiv.appendChild(tableRangePartitionConditionForm);
    $(".rangePartitionTypeTableDiv").hide();
    partitionConditionDiv.appendChild(rangePartitionTypeTableDiv);
    partitionConditionDiv.appendChild(btnPartitionCondition);
    partitionConditionDiv.appendChild(partitionCloseButton);

    lot.appendChild(partitionConditionDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function savePartitionDetailsToStream(clickedId,streamType,fromStreamIndex,fromStreamName)
{
    var partitionIdInput = document.getElementById("partitionIdInput").value;
    var partitionConditionElementID = clickedId;
    var elClickedId= clickedId.substr(0, clickedId.indexOf('-')); //1-pc1
    var subPcId= clickedId.substr(clickedId.indexOf("c") + 1);


    if (streamType == "import" || streamType == "export")
    {
        var tablevar = document.getElementById('tableVariablePartitionConditionDisplay');
        var tableran = document.getElementById('tableRangePartitionConditionDisplay');

        if (tableran == null) {
            var tblerows = (tablevar.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerows);

            for (r = 1; r < tblerows; r++) {
                for (var c = 0; c < 1; c++) {
                    var attrNm = tablevar.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = attrNm;

                    var predefarr = PredefinedStreams();
                    for (var x = 0; x < predefarr.length; x++) {
                        for (var y = 0; y < predefarr[x][1].length; y++) {
                            if (predefarr[x][1][y] == attrNm) {
                                createdPartitionConditionArray[elClickedId][2][r - 1][1] = predefarr[x][2][y];
                            }
                        }
                    }

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }

            }
            createdPartitionConditionArray[elClickedId][4] = tblerows - 1;
        }
        else {
            var tblerowsRange = (tableran.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerowsRange);

            for (r = 1; r < tblerowsRange; r++) {
                for (var c = 0; c < 1; c++) {
                    var range = tableran.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = range;
                    createdPartitionConditionArray[elClickedId][2][r - 1][1] = null;

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }
            }
            createdPartitionConditionArray[elClickedId][4] = tblerowsRange - 1;
        }

        createdPartitionConditionArray[elClickedId][0] = elClickedId;
        createdPartitionConditionArray[elClickedId][1] = partitionIdInput;
        createdPartitionConditionArray[elClickedId][3] = "Partition Condition";
        createdPartitionConditionArray[elClickedId][5] = subPcId;
        createdPartitionConditionArray[elClickedId][6] = fromStreamName;


    }

    //Todo display all connected partitions

    else if (streamType == "defined") {
        var partitionIdInput = document.getElementById("partitionIdInput").value;
        var partitionConditionElementID = clickedId;

        var tablevar = document.getElementById('tableVariablePartitionConditionDisplay');
        var tableran = document.getElementById('tableRangePartitionConditionDisplay');

        if (tableran == null) {
            var tblerows = (tablevar.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerows);

            for (r = 1; r < tblerows; r++) {
                for (var c = 0; c < 1; c++) {
                    var attrNm = tablevar.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = attrNm;

                    for (var x = 0; x < createdDefinedStreamArray[fromStreamIndex][2].length-1; x++) {
                        if (createdDefinedStreamArray[fromStreamIndex][2][x][0] == attrNm) {
                            createdPartitionConditionArray[elClickedId][2][r - 1][1] = createdDefinedStreamArray[fromStreamIndex][2][x][1];
                        }

                    }

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }

            }
            createdPartitionConditionArray[elClickedId][4] = tblerows - 1;
        }
        else {
            var tblerowsRange = (tableran.rows.length);
            createdPartitionConditionArray[elClickedId][2] = new Array(tblerowsRange);

            for (r = 1; r < tblerowsRange; r++) {
                for (var c = 0; c < 1; c++) {
                    var range = tableran.rows[r].cells[c].innerHTML;
                    createdPartitionConditionArray[elClickedId][2][r - 1] = new Array(2);
                    createdPartitionConditionArray[elClickedId][2][r - 1][0] = range;
                    createdPartitionConditionArray[elClickedId][2][r - 1][1] = null;

                    // alert("Attr name: " + createdPartitionConditionArray[elClickedId][2][r - 1][0] + "\nAttr type: " + createdPartitionConditionArray[elClickedId][2][r - 1][1]);
                }
            }
            createdPartitionConditionArray[elClickedId][4] = tblerowsRange - 1;
        }


        createdPartitionConditionArray[elClickedId][0] = elClickedId;
        createdPartitionConditionArray[elClickedId][1] = partitionIdInput;
        createdPartitionConditionArray[elClickedId][3] = "Partition Condition";
        createdPartitionConditionArray[elClickedId][4] = createdDefinedStreamArray[fromStreamIndex][2].length;
        createdPartitionConditionArray[elClickedId][5] = subPcId;
        createdPartitionConditionArray[elClickedId][6] = fromStreamName;



    }
    else if (streamType == "window") {

    }
    else {
        alert("This type of element cannot be connected to a partition condition");
    }

    // alert("experimental size : "+ createdPartitionConditionArray[elClickedId][7].length);


    // alert("clicked ID: "+createdPartitionConditionArray[elClickedId][0]+"partition name: "+createdPartitionConditionArray[elClickedId][1]+"what: "+createdPartitionConditionArray[elClickedId][2]+"len: "+createdPartitionConditionArray[elClickedId][4]+"subpc: "+createdPartitionConditionArray[elClickedId][5]+"selectedStream: "+createdPartitionConditionArray[elClickedId][6])
    //
    // alert("Element Id: " + createdPartitionConditionArray[elClickedId][0] + "\nName: " + createdPartitionConditionArray[elClickedId][1] + "\nDef: " + createdPartitionConditionArray[elClickedId][3] + "\ntable Rows: " + createdPartitionConditionArray[elClickedId][4]+ "\nSub pc id: " + createdPartitionConditionArray[elClickedId][5]);


    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
    document.getElementById(clickedId).innerHTML=partitionIdInput;
    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function partitiontypeGenerate(streamType,selctedSt,fromStreamIndex,defAttrNum, type)
{
    var attributes = [];
    // alert("fromStreamIndex:"+fromStreamIndex);

    if(streamType=="import" || streamType=="export")
    {
        var predefarr = PredefinedStreams();
        for(var x = 0; x<predefarr.length; x++)
        {
            if (predefarr[x][0] == selctedSt)
            {
                for(var n=0; n<predefarr[x][1].length;n++)
                {
                    attributes.push(predefarr[x][1][n]);
                }
            }
        }
    }
    else if(streamType=="defined")
    {
        for(var m=0;m<defAttrNum-1;m++)
        {
            attributes.push(createdDefinedStreamArray[fromStreamIndex][2][m][0]);
        }
    }
    else
    {
        if(type==null)
        {
            for (var m = 0; m < defAttrNum - 1; m++)
            {
                attributes.push(createdWindowStreamArray[fromStreamIndex][4][m][0]);
            }

        }
        else
        {
            //alert("Define method");
            for (var m = 0; m < defAttrNum - 1; m++)
            {
                attributes.push(createdWindowStreamArray[fromStreamIndex][4][m][0]);
            }
        }
    }

    return attributes;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tableVariablePartitionConditionDisplay = document.createElement('table');
tableVariablePartitionConditionDisplay.id = "tableVariablePartitionConditionDisplay";
tableVariablePartitionConditionDisplay.className = "tableVariablePartitionConditionDisplay";
var tr = document.createElement('tr');
var tdVarPartitionTypeTitle = document.createElement('td');
var tdVarPartitionTypeDelete   = document.createElement('td');
tdVarPartitionTypeTitle.innerHTML = "Partition Type";
tdVarPartitionTypeDelete.innerHTML = "Delete";
tr.appendChild(tdVarPartitionTypeTitle);
tr.appendChild(tdVarPartitionTypeDelete);
tableVariablePartitionConditionDisplay.appendChild(tr);


function addVariablePartitionTypeToTable()
{
    var tr = document.createElement('tr');
    var choice=document.getElementById("partitionTypeComboForPartition");
    var partitionTypeCombo = choice.options[choice.selectedIndex].text;

    var trow = document.createElement('tr');
    var tdPartitionType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var partitionType = document.createTextNode(partitionTypeCombo);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    var text3= "<img src='../Images/Delete.png'>";
    deletebtn.innerHTML = text3;
    deletebtn.onclick = function() {
        deleteRowForVariablePartition(this);
    };

    tdPartitionType.appendChild(partitionType);
    tdDelete.appendChild(deletebtn);
    trow.appendChild(tdPartitionType);
    trow.appendChild(tdDelete);
    tableVariablePartitionConditionDisplay.appendChild(trow);
    variablePartitionTypeTableDisplayDiv.appendChild(tableVariablePartitionConditionDisplay);
    $(".variablePartitionTypeTableDisplayDiv").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var tableRangePartitionConditionDisplay = document.createElement('table');
tableRangePartitionConditionDisplay.id = "tableRangePartitionConditionDisplay";
tableRangePartitionConditionDisplay.className = "tableRangePartitionConditionDisplay";
var tr = document.createElement('tr');
var tdRanPartitionTypeTitle = document.createElement('td');
var tdRanPartitionTypeDelete   = document.createElement('td');
tdRanPartitionTypeTitle.innerHTML = "Partition Type";
tdRanPartitionTypeDelete.innerHTML = "Delete";
tr.appendChild(tdRanPartitionTypeTitle);
tr.appendChild(tdRanPartitionTypeDelete);
tableRangePartitionConditionDisplay.appendChild(tr);


function addRangePartitionTypeToTable()
{
    var tr = document.createElement('tr');
    var choice=document.getElementById("rangePartitionTypeInput").value;

    var trow = document.createElement('tr');
    var tdPartitionType = document.createElement('td');
    var tdDelete   = document.createElement('td');

    var partitionType = document.createTextNode(choice);
    var deletebtn =  document.createElement("button");
    deletebtn.type="button";
    deletebtn.id ="deletebtn";
    var text3= "<img src='../Images/Delete.png'>";
    deletebtn.innerHTML = text3;
    deletebtn.onclick = function() {
        deleteRowForRangePartition(this);
    };

    tdPartitionType.appendChild(partitionType);
    tdDelete.appendChild(deletebtn);
    trow.appendChild(tdPartitionType);
    trow.appendChild(tdDelete);
    tableRangePartitionConditionDisplay.appendChild(trow);
    rangePartitionTypeTableDisplayDiv.appendChild(tableRangePartitionConditionDisplay);
    $(".rangePartitionTypeTableDisplayDiv").show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * @param newAgent
 * @param i
 * @param e
 * @description Drops the join query element as its in connector can permit 2 connections and its out connector can permit only one connection
 *
 */

function dropCompleteJoinQueryElement(newAgent,i,e,topP,left)
{
    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorIn">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOut">').attr('id', i + '-out').addClass('connection');

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
        anchor: 'Left',
        maxConnections:2
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        maxConnections:1
    });

}


function CreateWindow(elementID)
{
    elementID = elementID.charAt(0);
    var table = document.getElementById('attrtableForWindow');
    var tblerows = (table.rows.length);

    var windowInput = document.getElementById("DefNameForWindow").value;

    createdWindowStreamArray[elementID][0] = elementID;
    createdWindowStreamArray[elementID][1] = windowInput;
    createdWindowStreamArray[elementID][2] = null;
    createdWindowStreamArray[elementID][3] = null;
    createdWindowStreamArray[elementID][4] = new Array(tblerows);

    for (var r = 1; r < tblerows; r++)
    {
        for (var c = 0; c < 1; c++)
        {
            var attrNm = table.rows[r].cells[c].innerHTML;
            var attrTp = table.rows[r].cells[1].innerHTML;
            createdWindowStreamArray[elementID][4][r-1] = [];
            createdWindowStreamArray[elementID][4][r-1][0] = attrNm;
            createdWindowStreamArray[elementID][4][r-1][1] = attrTp;
        }
    }
    // alert("Element ID:"+createdWindowStreamArray[elementID][0]+"\nElement Name:"+createdWindowStreamArray[elementID][1]+"\nSelected Stream Index:"+createdWindowStreamArray[elementID][2]+"\nSelected Stream:"+createdWindowStreamArray[elementID][3]+"\nAttributes:"+createdWindowStreamArray[elementID][4]);


    var elIdforNode =  elementID+"-windowNode";
    document.getElementById(elIdforNode).innerHTML = windowInput;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}


function getFromStreamNameForWindow(fromStreamId,elementID)
{
    var fromNameSt, selctedSt,streamType;
    var fromStreamIndex;
    var predefarr = PredefinedStreams();
    var lengthPreDef = predefarr.length;

    //alert("array legth:"+lengthPreDef);
    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'from Stream' Name
        if(createdImportStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdImportStreamArray[x][2];
            selctedSt = createdImportStreamArray[x][1];
            streamType = "import";

            for(var f =0; f<lengthPreDef; f++)
            {
                if(predefarr[f][0]==selctedSt)
                {
                    fromStreamIndex =f;
                }
            }
        }
        else if(createdExportStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdExportStreamArray[x][2];
            selctedSt = createdExportStreamArray[x][1];
            streamType = "export";
            for(var f =0; f<lengthPreDef; f++)
            {
                if(predefarr[f][0]==selctedSt)
                {
                    fromStreamIndex =f;
                }
            }
        }
        else if(createdDefinedStreamArray[x][0]==fromStreamId)
        {
            fromNameSt = createdDefinedStreamArray[x][1];

            var defAttrNum = createdDefinedStreamArray[x][2].length;
            streamType = "defined";
            fromStreamIndex =createdDefinedStreamArray[x][0];
        }

    }
    //To retrieve the number of projections
    getAttributes(selctedSt);
    //attrNumber gives the number of projections
    //streamInd gives the index of the selected stream
    createWindowStreamForm(elementID, fromNameSt,fromStreamIndex,streamType, defAttrNum);
}

function createWindowStreamForm(elementID, fromNameSt,fromStreamIndex,streamType, defAttrNum)
{
    $("#container").addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");

    var tableWindowStreamForm = document.createElement('table');
    tableWindowStreamForm.id = "tableWindowStreamForm";
    tableWindowStreamForm.className = "tableWindowStreamForm";

    windowStreamDiv=document.createElement("div");
    windowStreamDiv.className="windowStreamDiv";
    windowStreamDiv.id="windowStreamDiv";

    var predefarr = PredefinedStreams();

    windowStreamDiv=document.createElement("div");
    windowStreamDiv.className="windowStreamDiv";
    windowStreamDiv.id="windowStreamDiv";

    windowStreamLabel= document.createElement("label");
    windowStreamLabel.className="windowStreamLabel";
    windowStreamLabel.id="windowStreamLabel";
    windowStreamLabel.innerHTML='Window';

    selectedStreamForWindowLabel= document.createElement("label");
    selectedStreamForWindowLabel.id ="selectedStreamForWindowLabel";
    selectedStreamForWindowLabel.className ="selectedStreamForWindowLabel";
    selectedStreamForWindowLabel.innerHTML = "Selected Stream: ";

    selectedStreamForWindow= document.createElement("label");
    selectedStreamForWindow.id ="selectedStreamForWindow";
    selectedStreamForWindow.className ="selectedStreamForWindow";
    selectedStreamForWindow.innerHTML = fromNameSt;

    windowStreamName= document.createElement("label");
    windowStreamName.id ="windowStreamName";
    windowStreamName.className ="windowStreamName";
    windowStreamName.innerHTML = "Window name";

    windowStreamNameInput= document.createElement("input");
    windowStreamNameInput.id = "windowStreamNameInput";
    windowStreamNameInput.className = "windowStreamNameInput";

    windowStreamFormButton=document.createElement("button");
    windowStreamFormButton.type="button";
    windowStreamFormButton.className="windowStreamFormButton";
    windowStreamFormButton.id="windowStreamFormButton";
    windowStreamFormButton.innerHTML="Submit";
    windowStreamFormButton.onclick = function () {
        getwindowStreamData(elementID, fromStreamIndex,streamType, defAttrNum);
    };

    windowStreamFomCloseButton=document.createElement("button");
    windowStreamFomCloseButton.type="button";
    windowStreamFomCloseButton.className="windowStreamFomCloseButton";
    windowStreamFomCloseButton.id="windowStreamFomCloseButton";
    windowStreamFomCloseButton.innerHTML="Cancel";
    windowStreamFomCloseButton.onclick = function() {
        closeForm();
    };

    windowStreamDiv.appendChild(windowStreamLabel);

    //Row 1

    var tr1 = document.createElement('tr');
    var td1=document.createElement('td');
    var td2=document.createElement('td');

    td1.appendChild(selectedStreamForWindowLabel);
    tr1.appendChild(td1);
    td2.appendChild(selectedStreamForWindow);
    tr1.appendChild(td2);
    tableWindowStreamForm.appendChild(tr1);

    //Row 2

    var tr2 = document.createElement('tr');
    var td3=document.createElement('td');
    var td4=document.createElement('td');

    td3.appendChild(windowStreamName);
    tr2.appendChild(td3);
    td4.appendChild(windowStreamNameInput);
    tr2.appendChild(td4);
    tableWindowStreamForm.appendChild(tr2);

    //Row 3

    var tr3 = document.createElement('tr');
    var td5=document.createElement('td');
    var td6=document.createElement('td');

    td5.appendChild(windowStreamFormButton);
    tr3.appendChild(td5);
    td6.appendChild(windowStreamFomCloseButton);
    tr3.appendChild(td6);
    tableWindowStreamForm.appendChild(tr3);

    windowStreamDiv.appendChild(tableWindowStreamForm);
    lot.appendChild(windowStreamDiv);

    $(".toolbox-titlex").show();
    $(".panel").show();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getwindowStreamData(elementID, fromStreamIndex,streamType, defAttrNum)
{
    var windowStreamName = document.getElementById("selectedStreamForWindow").innerHTML;
    var windowInput = document.getElementById("windowStreamNameInput").value;
    var predefarr = PredefinedStreams();
    createdWindowStreamArray[elementID][0] = elementID;
    createdWindowStreamArray[elementID][1] = windowInput;
    createdWindowStreamArray[elementID][2] = fromStreamIndex;
    createdWindowStreamArray[elementID][3] = windowStreamName;
    createdWindowStreamArray[elementID][4] = [];

    //alert("Element ID:"+createdWindowStreamArray[elementID][0]+"\nElement Name:"+createdWindowStreamArray[elementID][1]+"\nSelected Stream Index:"+createdWindowStreamArray[elementID][2]+"\nSelected Stream:"+createdWindowStreamArray[elementID][3]);
    if(streamType=="import" || streamType=="export")
    {
        for (var f = 0; f < attrNumber; f++)
        {
            createdWindowStreamArray[elementID][4][f]=[];
            createdWindowStreamArray[elementID][4][f][0] = predefarr[fromStreamIndex][1][f];
            createdWindowStreamArray[elementID][4][f][1] = predefarr[fromStreamIndex][2][f];
            //alert("Attribute: "+createdWindowStreamArray[elementID][4][f][0]+"\nAttribute Type:"+createdWindowStreamArray[elementID][4][f][1]);
        }
    }
    else
    {
        for (var f =0; f<defAttrNum-1;f++)
        {
            createdWindowStreamArray[elementID][4][f]=[];
            createdWindowStreamArray[elementID][4][f][0] = createdDefinedStreamArray[fromStreamIndex][2][f][0];
            createdWindowStreamArray[elementID][4][f][1] = createdDefinedStreamArray[fromStreamIndex][2][f][1];
            //alert("Attribute: "+createdWindowStreamArray[elementID][4][f][0]+"\nAttribute Type:"+createdWindowStreamArray[elementID][4][f][1]);
        }
    }

    var elIdforNode =  elementID+"-windowNode";
    document.getElementById(elIdforNode).innerHTML = windowInput;

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");

    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();
}

function closeForm()
{
    var myNode = document.getElementById("lot");
    var fc = myNode.firstChild;

    while( fc ) {
        myNode.removeChild( fc );
        fc = myNode.firstChild;
    }

    $(".toolbox-titlex").hide();
    $(".panel").hide();

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var wqueryDiv;
var windowQueryLabel, windowQueryName,wqueryNameInput, wfromStreamLabel, wfromStream, wfilterLabel1,wfilterInput1, wselectLabel, winsertIntoLabel, winsertIntoStream;
var windowLabel, windowInput, wfilterLabel2,wfilterInput2;
var winputtxtName, winputlblName;
var wqueryFomButton;

var jfromStreamId1,jfromStreamId2, jintoStreamId;

function getJoinConnectionDetails(element)
{
    var clickedId =  element.id;
    clickedId=clickedId.charAt(0);
    var from = clickedId+"-out";
    var from1 = clickedId;
    clickedId = clickedId+"-in";
    var con=jsPlumb.getAllConnections();
    var list=[];
    var checkPoint=-1;

    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            if(checkPoint==-1)
            {
                list[i] = new Array(2);
                list[i][0] = [];
                list[i][0]=con[i].sourceId;
                jfromStreamId1 =list[i][0];
                list[i][1] = con[i].targetId;
                checkPoint=i;
            }
            else
            {
                list[i] = new Array(2);
                list[i][0] = [];
                list[i][0]=con[i].sourceId;
                jfromStreamId2 =list[i][0];
                list[i][1] = con[i].targetId;
                checkPoint=i;
            }
        }

        if(con[i].sourceId==from || con[i].sourceId==from1)
        {
            list[i] = new Array(2);
            list[i][0] = con[i].sourceId;
            list[i][1] = con[i].targetId;
            jintoStreamId =list[i][1];
        }
    }

    jintoStreamId = jintoStreamId.charAt(0);
    getJoinFromStreamName(jfromStreamId1,jfromStreamId2,jintoStreamId,element.id);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPartitionConnectionDetails(element)
{
    var clickedId =  element;

    var con=jsPlumb.getAllConnections();
    var connectedStream, selectedStreamName;
    var list=[];
    var checkPoint=-1;

    for(var i=0;i<con.length;i++)
    {
        if(con[i].targetId==clickedId)
        {
            connectedStream = con[i].sourceId;
        }
    }

    //partitionintoId = partitionintoId.charAt(0);
    getPartitionFromStreamName(clickedId,connectedStream);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getJoinFromStreamName(jfromStreamId1,jfromStreamId2,jintoStreamId,clickedId)
{
    var fromNameSt1,fromNameSt2, intoNameSt, streamType, selctedSt;
    var elementID=clickedId.charAt(0);

    //alert("jfromStreamId1: "+jfromStreamId1+"\njfromStreamId2: "+jfromStreamId2);

    /*The following checks whether the source/ the from stream is a Parttion condition
     This is done by pattern matching of the source's/from Stream's ID
     */
    var elClickedId1= jfromStreamId1.substr(0, jfromStreamId1.indexOf('-'));
    var subPcId1= jfromStreamId1.substr(jfromStreamId1.indexOf("c") + 1);
    var idTest1=/^\d+-pc\d+$/.test(jfromStreamId1);

    var elClickedId2= jfromStreamId2.substr(0, jfromStreamId2.indexOf('-'));
    var subPcId2= jfromStreamId2.substr(jfromStreamId2.indexOf("c") + 1);
    var idTest2=/^\d+-pc\d+$/.test(jfromStreamId2);
    var fromStreamIndex1,fromStreamIndex2,intoStreamIndex;


    // alert("elClickedId1: "+elClickedId1+"\nsubPcId1: "+subPcId1+"\nidTest1: "+idTest1+"\n--------------------------------"+"\nelClickedId2: "+elClickedId2+"\nsubPcId2: "+subPcId2+"\nidTest2: "+idTest2+"\n--------------------------------");

    /*
     If the pattern doesn't match, the from stream is not a Partition Condition anchor
     So can traverse through the Import, Export, Defined and Window Streams
     @function : To retrieve the first 'from Stream' Name (Left/Right)
     */
    if(idTest1==false)
    {
        jfromStreamId1 = jfromStreamId1.charAt(0);
        for(var x = 0; x<100; x++) {

            if (createdImportStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdImportStreamArray[x][2];
                fromStreamIndex1 = x;
            }
            else if (createdExportStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdExportStreamArray[x][2];
                fromStreamIndex1 = x;
            }
            else if (createdDefinedStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdDefinedStreamArray[x][1];
                fromStreamIndex1 = x;
            }
            else if (createdWindowStreamArray[x][0] == jfromStreamId1) {
                fromNameSt1 = createdWindowStreamArray[x][1];
                fromStreamIndex1 = x;
            }
        }
    }

    /*
     If the source is a Partition condition anchor, can retrieve the Stream/Window's name that it is associated with
     or inherits from
     */

    else
    {
        for(var f=0;f<100;f++)
        {
            if(createdPartitionConditionArray[f][0]==elClickedId1 && createdPartitionConditionArray[f][5] == subPcId1)
            {
                fromNameSt1 = createdPartitionConditionArray[f][6];
                fromStreamIndex1 = elClickedId1;
            }
        }

    }

    /*
     @function : To retrieve the second 'from Stream' Name (Left/Right)
     */

    if(idTest2==false)
    {
        jfromStreamId2 = jfromStreamId2.charAt(0);
        for(var x = 0; x<100; x++)
        {
            if (createdImportStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdImportStreamArray[x][2];
                fromStreamIndex2 = x;
            }
            else if (createdExportStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdExportStreamArray[x][2];
                fromStreamIndex2 = x;
            }
            else if (createdDefinedStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdDefinedStreamArray[x][1];
                fromStreamIndex2 = x;
            }
            else if (createdWindowStreamArray[x][0] == jfromStreamId2) {
                fromNameSt2 = createdWindowStreamArray[x][1];
                fromStreamIndex2 = x;
            }
        }
    }
    else
    {
        for(var f=0;f<100;f++)
        {
            if(createdPartitionConditionArray[f][0]==elClickedId2 && createdPartitionConditionArray[f][5] == subPcId2)
            {
                fromNameSt2 = createdPartitionConditionArray[f][6];
                fromStreamIndex2 = elClickedId2;
            }
        }
    }

    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'into Stream' Name
        if (createdImportStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdImportStreamArray[x][2];
            streamType = "import";
            selctedSt = createdImportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdExportStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdExportStreamArray[x][2];
            streamType = "export";
            selctedSt = createdExportStreamArray[x][1];
            intoStreamIndex = x;
        }
        else if (createdDefinedStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdDefinedStreamArray[x][1];
            streamType = "defined";
            intoStreamIndex = x;
            var defAttrNum = createdDefinedStreamArray[x][2].length;
        }
        else if (createdWindowStreamArray[x][0] == jintoStreamId) {
            intoNameSt = createdWindowStreamArray[x][1];
            streamType = "window";
            intoStreamIndex = x;
            var defAttrNum = createdDefinedStreamArray[x][4].length;

        }
    }


    //To retrieve the number of projections
    getAttributes(selctedSt);
    //attrNumber gives the number of projections
    //streamInd gives the index of the selected stream
    createJoinQueryForm(elementID, fromNameSt1,fromNameSt2, intoNameSt, fromStreamIndex1,fromStreamIndex2, intoStreamIndex, streamType, defAttrNum);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPartitionFromStreamName(clickedId, connectedStream)
{
    var streamType, selctedSt, fromStreamIndex;
    var fromStreamName;
    var connectedStream =  connectedStream.charAt(0);
    // alert("getPartitionFromStreamName-connectedStream: "+connectedStream);
    for(var x = 0; x<100; x++)
    {
        //To retrieve the 'from Stream' Names
        if (createdImportStreamArray[x][0] == connectedStream) {
            fromStreamName=createdImportStreamArray[x][2];
            streamType = "import";
            selctedSt = createdImportStreamArray[x][1];
            fromStreamIndex = x;
        }
        else if (createdExportStreamArray[x][0] == connectedStream) {
            fromStreamName=createdExportStreamArray[x][2];
            streamType = "export";
            selctedSt = createdExportStreamArray[x][1];
            fromStreamIndex = x;
        }
        else if (createdDefinedStreamArray[x][0] == connectedStream) {
            fromStreamName=createdDefinedStreamArray[x][1];
            var defAttrNum = createdDefinedStreamArray[x][2].length;
            streamType = "defined";
            fromStreamIndex = x;

        }
        else if (createdWindowStreamArray[x][0] == connectedStream.charAt(0)) {
            fromStreamName=createdWindowStreamArray[x][1];
            var type=createdWindowStreamArray[x][2];
            var defAttrNum = createdWindowStreamArray[x][4].length;
            streamType = "window";
            fromStreamIndex = x;
        }
    }

    //To retrieve the number of projections
    getAttributes(selctedSt);
    //attrNumber gives the number of projections
    //streamInd gives the index of the selected stream
    setPartitionConditionform(clickedId,selctedSt,fromStreamName,streamType,fromStreamIndex, defAttrNum, type);
}


