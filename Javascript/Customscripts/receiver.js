app.Receiver = Backbone.Model.extend({
    defaults: {
        id : '',
        name: '',
        stream:''
    }
});




function dropReceiver(newAgent, i,topP,left,asName)
{
    var receiverModel = new app.Receiver;
    receiverModel.set('id' , i);
    receiverModel.set('name' , 'ReceiverY');
    receiverList.add(receiverModel);

    var receiver = document.createElement("div");
    receiver.id = i+"-receiver";
    receiver.className = "receiverNameNode";
    var receiverTextNode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    receiverTextNode.id = i+"-receiverText";
    receiver.appendChild(receiverTextNode);

    var propertiesIcon = $('<div class="element-prop-icon"><b><img src="../Images/settings.png" ></b></div> ').attr('id', (i+('-prop')));
    var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="element-conn-icon"></b></div> ').attr('id', (i+'vis'));
    newAgent.append(receiver).append('<div class="element-close-icon" id="boxclose"><b><img src="../Images/Cancel.png"></b></div> ').append(conIcon).append(propertiesIcon);

    var finalElement =  newAgent;
    var connectionOut = $('<div class="connectorOutReceiver">').attr('id', i + '-Out');

    finalElement.css({
        'top': topP,
        'left': left
    });

    finalElement.append(connectionOut);
    $('#container').append(finalElement);

    jsPlumb.draggable(finalElement, {
        containment: 'parent'
    });

    jsPlumb.addEndpoint(connectionOut,{
        isSource : true,
        isTarget : true,
        endpoint : "Dot",
        anchor : "Right",
        uniqueEndpoint :true,
        maxConnection : 1,
        deleteEndpointsOnDetach:false
    });
    // jsPlumb.makeSource(connectionOut,{
    //     endPoint : "Dot",
    //         anchor :"Continuous",
    //         connectionsDetachable:true,
    //         uniqueEndpoint :true,
    //         maxConnection : 1
    // });
}