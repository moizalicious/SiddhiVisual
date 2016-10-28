function dropExecutionPlan(newAgent, i,topP,left,asName)
{
    var planNode = document.createElement("div");
    planNode.id = i+"-planNode";
    planNode.className = "planNameNode";
    var planTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    planTextNode.id = i+"-planTextNode";
    planNode.appendChild(planTextNode);

    var propertiesIcon = $('<a onclick=""><b><img src="../Images/settings.png" class="element-prop-icon"></b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(planNode).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(propertiesIcon);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorInExecutionPlan">').attr('id', i + '-in').addClass('connection');
    var connectionOut = $('<div class="connectorOutExecutionPlan">').attr('id', i + '-out').addClass('connection');

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

    jsPlumb.makeTarget(connectionIn,{
        anchor :"Continuous",
        uniqueEndpoint : true,
        maxConnections : -1

    });

    jsPlumb.makeSource(connectionOut,{
        anchor : "Continuous",
        uniqueEndpoint : true,
        maxConnections : -1
    });

}