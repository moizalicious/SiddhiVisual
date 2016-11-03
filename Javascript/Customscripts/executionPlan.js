function dropExecutionPlan(newAgent, i,topP,left,asName)
{
    var executionModel = new app.Receiver;
    executionModel.set('id' , i);
    executionModel.set('name' , 'ExecutionPlan');
    executionPlanList.add(executionModel);

    var planNode = document.createElement("div");
    planNode.id = i+"-planNode";
    planNode.className = "planNameNode";
    var planTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    planTextNode.id = i+"-planTextNode";
    planNode.appendChild(planTextNode);

    var propertiesIcon = $('<a  class="element-prop-icon"><b><img src="../Images/settings.png"</b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(planNode).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(propertiesIcon);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;

    var connectionIn = $('<div class="connectorInExecutionPlan">').attr('id', i + '-In');
    var connectionOut = $('<div class="connectorOutExecutionPlan">').attr('id', i + '-Out');
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

    // jsPlumb.makeTarget(connectionIn,{
    //     anchor :"Continuous",
    //     uniqueEndpoint : true,
    //     maxConnections : -1
    //
    // });
    //
    // jsPlumb.makeSource(connectionOut,{
    //     anchor : "Continuous",
    //     uniqueEndpoint : true,
    //     maxConnections : -1
    // });
    jsPlumb.addEndpoint(connectionIn,{
        isTarget : true,
        isSource : true,
        endpoint : "Dot",
        anchor : 'Left',
        maxConnections : -1
    });
    jsPlumb.addEndpoint(connectionOut,{
        isTarget : true,
        isSource : true,
        endpoint : "Dot",
        anchor : 'Right',
        maxConnections : -1
    });

}