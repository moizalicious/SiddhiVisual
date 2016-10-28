function dropReceiver(newAgent, i,topP,left,asName)
{
    var receiver = document.createElement("div");
    receiver.id = i+"-receiver";
    receiver.className = "receiverNameNode";
    var receiverTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    receiverTextNode.id = i+"-receiverText";
    receiver.appendChild(receiverTextNode);

    var propertiesIcon = $('<a onclick="getConnectionDetailsForWindow(this)"><b><img src="../Images/settings.png" class="element-prop-icon"></b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(receiver).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(propertiesIcon);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;
    var connectionOut = $('<div class="connectorOutReceiver">').attr('id', i + '-out').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionOut);
    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    // jsPlumb.addEndpoint(connectionOut,{
    //     isSource : true,
    //     isTarget : true,
    //     endpoint : "Dot",
    //     anchors:["Right", "Continuous"],
    //     uniqueEndpoint :true,
    //     maxConnection : 1
    // });
    jsPlumb.makeSource(connectionOut,{
        endPoint : "Dot",
            anchor :"Continuous",
            connectionsDetachable:true,
            uniqueEndpoint :true,
            maxConnection : 1
    });
}