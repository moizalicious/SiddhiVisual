function dropPublisher(newAgent, i, topP,left,asName)
{
    var publisherModel = new app.Publisher;
    publisherModel.set('id' , i);
    publisherModel.set('name' , 'PublisherZ');
    publisherList.add(publisherModel);

    var publisher= document.createElement("div");
    publisher.id = i+"-publisher";
    publisher.className = "publisherNameNode";
    var publisherTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    publisherTextNode.id = i+"-publisherText";
    publisher.appendChild(publisherTextNode);

    var propertiesIcon = $('<a class="element-prop-icon"><b><img src="../Images/settings.png" ></b></a> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" class="element-conn-icon"></b></a> ').attr('id', (i+'vis'));
    newAgent.append(publisher).append('<a class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(propertiesIcon);

    $(droppedElement).draggable({containment: "container"});

    var finalElement =  newAgent;
    var connectionIn = $('<div class="connectorInPublisher">').attr('id', i + '-In');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionIn);
    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment : 'parent'
    });

    jsPlumb.addEndpoint(connectionIn,{
        isTarget : true,
        isSource : true,
        endpoint : "Dot",
        anchor : 'Left',
        uniqueEndpoint : true,
        maxConnection : 1,
        deleteEndpointsOnDetach: false
    });

    // jsPlumb.makeTarget(connectionIn, {
    //     anchor: 'Continuous',
    //     maxConnections:1
    // });


}