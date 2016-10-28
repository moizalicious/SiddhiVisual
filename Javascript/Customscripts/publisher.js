function dropPublisher(newAgent, i, topP,left,asName)
{
    var publisher= document.createElement("div");
    publisher.id = i+"-publisher";
    publisher.className = "publisherNameNode";
    var publisherTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    publisherTextNode.id = i+"-publisherText";
    publisher.appendChild(publisherTextNode);

    var propertiesIcon = $('<a onclick=""><b><img src="../Images/settings.png" class="element-prop-icon"></b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(publisher).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(propertiesIcon);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorInPublisher">').attr('id', i + '-in').addClass('connection');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment : 'parent'
    });

    // jsPlumb.addEndpoint(connectionIn,{
    //     isTarget : true,
    //     isSource : true,
    //     uuid : "134054",
    //     maxConnections :1,
    //     endpoint : "Dot",
    //     anchors : ["Left", "Continuous"],
    //     uniqueEndpoint : true,
    //     maxConnection : 1
    // });

    jsPlumb.makeTarget(connectionIn, {
        anchor: 'Continuous',
        maxConnections:1
    });


}