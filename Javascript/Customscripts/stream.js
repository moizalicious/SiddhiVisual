
function dropStream(newAgent,i,kind,ptop,left, name) {
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
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="element-conn-icon collapse ">').attr('id', (i+'vis'));
    newAgent.append(node).append('<img src="../Images/Cancel.png" class="element-close-icon collapse" id="boxclose">').append(conIcon).append(prop);
    var finalElement = newAgent;

    /*
     connection --> The connection anchor point is appended to the element
     */

    var connection1;
    var connection2;
    if(kind=="import")
    {
        connection1 = $('<div class="connectorInStream">').attr('id', i+"-Inimport" ).addClass('connection');
        connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outimport" ).addClass('connection');
    }
    else if (kind=="export")
    {
        connection1 = $('<div class="connectorInStream">').attr('id', i+"-Inexport" ).addClass('connection');
        connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outexport" ).addClass('connection');
    }
    else
    {
        connection1 = $('<div class="connectorInStream">').attr('id', i+"-Indefined" ).addClass('connection');
        connection2 = $('<div class="connectorOutStream">').attr('id', i+"-Outdefined" ).addClass('connection');
    }


    finalElement.css({
        'top': ptop,
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
        deleteEndpointsOnDetach : true
    });

    $("#container").removeClass("disabledbutton");
    $("#toolbox").removeClass("disabledbutton");
}

/**
 @function drop stream that is defined as the output stream in a query configuration
 * @param position   position of selected query
 * @param id    id of selected query
 * @param outStream     name for new output stream
 * @param streamAttributes      attributes list for output stream
 */
function dropStreamFromQuery(position , id, outStream, streamAttributes) {
    var elementID = i;
    var newAgent = $('<div>').attr('id', elementID).addClass('streamdrop node');

    //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
    $('#container').addClass("disabledbutton");
    $("#toolbox").addClass("disabledbutton");
    $('#container').append(newAgent);

    //drop the stream
    dropStream(newAgent, i, 'defined-stream', position.top, position.left + 200, outStream);

    //add the new out stream to the stream collection
    var newStream = new app.Stream;
    newStream.set('id', elementID);
    newStream.set('name', outStream);
    newStream.set('type', 'define-stream');
    newStream.set('attributes', streamAttributes);
    streamList.add(newStream);
    //make the connection
    jsPlumb.connect({
        source: id+'-out',
        target: elementID+'-Indefined'
    });
    //increment the global variable i and the final element count
    finalElementCount = i;
    i++;
}