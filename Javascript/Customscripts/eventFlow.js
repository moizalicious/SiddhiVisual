var i = 1;

//droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
var droptype;

// finalElementCount --> Number of elements that exist on the canvas at the time of saving the model
var finalElementCount=0;

/**
 * @description jsPlumb function opened
 */

jsPlumb.ready(function() {
    // jsPlumb.Defaults.Container = $("#container");
    jsPlumb.Defaults.PaintStyle = {strokeStyle: "darkblue", lineWidth: 2, dashstyle: '3 3'}; //Connector line style
    jsPlumb.Defaults.EndpointStyle = {radius: 7, fillStyle: "darkblue"}; //Connector endpoint/anchor style
    jsPlumb.importDefaults({Connector: ["Bezier", {curviness: 50}]}); //Connector line style
    jsPlumb.setContainer($('#container'));

    $("#container").droppable({
       accept : '.stream, .receiver, .publisher, .execution-plan',
        containment: 'container',
        drop: function (e, ui) {

            //mouseTop, mouseLeft - To retrieve the mouse position at the time of drop so that the elements can be placed at the same spot
            //TODO retrieve offset with regard to the container and not the page
            var mouseTop = e.pageY - $('#container').offset().top;
            var mouseLeft = e.pageX - $('#container').offset().left ;

            var dropElem = ui.draggable.attr('class');
            //Clone the element in the toolbox in order to drop the clone on the canvas
            droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).removeAttr("class");
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);

            //If the dropped Element is a Stream then->
            if (dropElem == "stream ui-draggable") {
                var newAgent = $('<div>').attr('id', i).addClass('streamdrop');

                //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
                $("#container").addClass("disabledbutton");
                $("#toolbox").addClass("disabledbutton");

                /*
                 Create a stream form where the user can set whether the dropped element is an Import/Export/defined stream
                 Element is not dropped on the canvas before the data is entered in the form as the user shouldn't be able to manipulate the
                 Stream element before it has been initialized
                 */

                $('#container').append(newAgent);

                createStreamForm(newAgent, i, e,mouseTop,mouseLeft);
                i++;    //Increment the Element ID for the next dropped Element
                finalElementCount=i;
                enableElements();
            }

            //If the dropped Element is a receiver
           else if (dropElem == "receiver ui-draggable") {

                var newAgent = $('<div>').attr('id', i).addClass('receiver-drop');
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropElement(newAgent, i, e,mouseTop,mouseLeft,"Receiver");
                i++;
                finalElementCount=i;
            }

            //If the dropped element is a publisher
            else if (dropElem == "publisher ui-draggable") {
                var newAgent = $('<div>').attr('id', i).addClass('publisher-drop');
                droptype = "squerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropElement(newAgent, i, e,mouseTop,mouseLeft,"Publisher");
                i++;
                finalElementCount=i;
            }

            //If the dropped element is a execution plan
            else if (dropElem == "execution-plan ui-draggable") {
                var newAgent = $('<div>').attr('id', i).addClass('execution-plan-drop');
                droptype = "squerydrop";
                //Drop the element instantly since its attributes will be set only when the user requires it
                dropElement(newAgent, i, e,mouseTop,mouseLeft,"Plan");
                i++;
                finalElementCount=i;
            }


            /*
             @function Delete an element detaching all its connections when the 'boxclose' icon is clicked
             @description Though the functionality of the 3 are the same, they are differenciated as their css positioning differs.
             */

            //Remove Element Icon for the stream elements
            newAgent.on('click', '.boxclose', function (e) {

                jsPlumb.detachAllConnections(newAgent.attr('id'));
                jsPlumb.removeAllEndpoints($(this));
                jsPlumb.detach($(this));
                $(newAgent).remove();
            });

            //Remove Element Icon for the Window stream element
            newAgent.on('click', '.boxclosewindow', function (e) {

                jsPlumb.detachAllConnections(newAgent.attr('id'));
                jsPlumb.removeAllEndpoints($(this));
                jsPlumb.detach($(this));
                $(newAgent).remove();
            });

            //Remove Element Icon for the query element
            newAgent.on('click', '.boxclose1', function (e) {

                jsPlumb.detachAllConnections(newAgent.attr('id'));
                jsPlumb.removeAllEndpoints($(this));
                jsPlumb.detach($(this));
                $(newAgent).remove();
            });
        }
    });
    function dropElement(newAgent, i, e,topP,left,asName)
    {
        var windowNode = document.createElement("div");
        windowNode.id = i+"-windowNode";
        windowNode.className = "windowNameNode";
        var windowTextnode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
        windowTextnode.id = i+"-windowTextnode";
        windowNode.appendChild(windowTextnode);

        var prop = $('<a onclick="getConnectionDetailsForWindow(this)"><b><img src="../Images/settings.png" class="windowSettingIconLoc"></b></a> ').attr('id', (i+('-prop')));
        var conIcon = $('<img src="../Images/connection.png" onclick="connectionShowHideToggle(this)" class="showIconDefinedwindow"></b></a> ').attr('id', (i+'vis'));
        newAgent.append(windowNode).append('<a class="boxclosewindow" id="boxclose"><b><img src="../Images/Cancel.png"></b></a> ').append(conIcon).append(prop);

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
});