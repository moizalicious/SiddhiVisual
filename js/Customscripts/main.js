var constants = {
    STREAM: 'streamdrop',
    PASS_THROUGH: 'squerydrop',
    FILTER: 'filterdrop',
    JOIN: 'joquerydrop',
    WINDOW_QUERY: 'wquerydrop',
    PATTERN: 'stquerydrop',
    WINDOW_STREAM: '',
    PARTITION: 'partitiondrop'
};


// i --> newAgent ID (Dropped Element ID)
var i = 1;
// finalElementCount --> Number of elements that exist on the canvas at the time of saving the model
var finalElementCount = 0;

/**
 * @description jsPlumb function opened
 */

jsPlumb.ready(function () {
    jsPlumb.importDefaults({
        PaintStyle: {
            strokeWidth: 2,
            stroke: 'darkblue',
            outlineStroke: "transparent",
            outlineWidth: "5"
            // lineWidth: 2
        },
        HoverPaintStyle: {
            strokeStyle: 'darkblue',
            strokeWidth: 3
        },
        Overlays: [["Arrow", {location: 1.0, id: "arrow"}]],
        DragOptions: {cursor: "crosshair"},
        Endpoints: [["Dot", {radius: 7}], ["Dot", {radius: 11}]],
        EndpointStyle: {
            radius: 3
        },
        ConnectionsDetachable: false,
        Connector: ["Bezier", {curviness: 50}]
    });
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
            var mouseTop = e.pageY - canvas.offset().top + canvas.scrollTop() - 40;
            var mouseLeft = e.pageX - canvas.offset().left + canvas.scrollLeft() - 60;
            //Clone the element in the toolbox in order to drop the clone on the canvas
            var droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);
            //droptype --> Type of query being dropped on the canvas (e.g. droptype = "squerydrop";)
            var droptype;
            var newAgent;
            //If the dropped Element is a Stream then->
            if ($(droppedElement).hasClass('stream')) {
                newAgent = $('<div>').attr('id', i).addClass('streamdrop ');

                //The container and the toolbox are disabled to prevent the user from dropping any elements before initializing a Stream Element
                canvas.addClass("disabledbutton");
                $("#toolbox").addClass("disabledbutton");

                canvas.append(newAgent);
                //generate the stream definition form
                defineStream(newAgent, i, mouseTop, mouseLeft);
                finalElementCount = i;
                i++;    //Increment the Element ID for the next dropped Element

            }

            //If the dropped Element is a Window(not window query) then->
            else if ($(droppedElement).hasClass('wstream')) {
                newAgent = $('<div>').attr('id', i).addClass('wstreamdrop');
                //Drop the element instantly since its projections will be set only when the user requires it
                dropWindowStream(newAgent, i, mouseTop, mouseLeft, "Window");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a Pass through Query then->
            else if ($(droppedElement).hasClass('squery')) {
                newAgent = $('<div>').attr('id', i).addClass('squerydrop');
                droptype = "squerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype, mouseTop, mouseLeft, "Empty Query");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a Filter query then->
            else if ($(droppedElement).hasClass('filter')) {
                newAgent = $('<div>').attr('id', i).addClass('filterdrop ');
                droptype = "filterdrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype, mouseTop, mouseLeft, "Empty Query");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a Window Query then->
            else if ($(droppedElement).hasClass('wquery')) {
                newAgent = $('<div>').attr('id', i).addClass('wquerydrop ');
                droptype = "wquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype, mouseTop, mouseLeft, "Empty Query");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a Join Query then->
            else if ($(droppedElement).hasClass('joquery')) {
                newAgent = $('<div>').attr('id', i).addClass('joquerydrop');
                droptype = "joquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype, mouseTop, mouseLeft, "Join Query");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a State machine Query(Pattern and Sequence) then->
            else if ($(droppedElement).hasClass('stquery')) {
                newAgent = $('<div>').attr('id', i).addClass('stquerydrop');
                droptype = "stquerydrop";
                //Drop the element instantly since its projections will be set only when the user requires it
                dropQuery(newAgent, i, droptype, mouseTop, mouseLeft, "Pattern Query");
                finalElementCount = i;
                i++;
            }

            //If the dropped Element is a Partition then->
            else {
                newAgent = $('<div>').attr('id', i).addClass('partitiondrop');
                //Drop the element instantly since its projections will be set only when the user requires it
                dropPartition(newAgent, i, mouseTop, mouseLeft);
                finalElementCount = i;

                i++;
            }
            registerElementEventListeners(newAgent);
        }
    });

    //auto align the diagram when the button is clicked
    $('#auto-align').click(function () {
        autoAlign();
    });

});

//check the validity of the connections and drop if invalid
jsPlumb.bind('beforeDrop', function (connection) {
    var connectionValidity = true;
    var target = connection.targetId;
    var targetId = target.substr(0, target.indexOf('-'));
    var targetElement = $('#' + targetId);

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceElement = $('#' + sourceId);


    //avoid the expose of inner-streams outside the group
    if (sourceElement.hasClass(constants.STREAM) && jsPlumb.getGroupFor(sourceId) != undefined) {
        if (jsPlumb.getGroupFor(sourceId) != jsPlumb.getGroupFor(targetId)) {
            connectionValidity = false;
            alert("Invalid Connection: Inner Streams are not exposed to outside");
        }
    }
    else if (targetElement.hasClass(constants.STREAM) && jsPlumb.getGroupFor(targetId) != undefined) {
        if (jsPlumb.getGroupFor(targetId) != jsPlumb.getGroupFor(sourceId)) {
            connectionValidity = false;
            alert("Invalid Connection: Inner Streams are not exposed to outside");
        }
    }
    if ($('#' + sourceId).hasClass(constants.PARTITION)) {
        if ($(jsPlumb.getGroupFor(targetId)).attr('id') != sourceId) {
            connectionValidity = false;
            alert("Invalid Connection: Connect to a partition query");
        }
    }
    else if (targetElement.hasClass(constants.PASS_THROUGH) || targetElement.hasClass(constants.FILTER) || targetElement.hasClass(constants.WINDOW_QUERY)
        || targetElement.hasClass(constants.PATTERN) || targetElement.hasClass(constants.JOIN)) {
        if (!(sourceElement.hasClass(constants.STREAM))) {
            connectionValidity = false;
            alert("Invalid Connection");
        }
    }
    else if (sourceElement.hasClass(constants.PASS_THROUGH) || sourceElement.hasClass(constants.FILTER) || sourceElement.hasClass(constants.WINDOW_QUERY)
        || sourceElement.hasClass(constants.PATTERN) || sourceElement.hasClass(constants.JOIN)) {
        if (!(targetElement.hasClass(constants.STREAM))) {
            connectionValidity = false;
            alert("Invalid Connection");
        }
    }
    return connectionValidity;
});

// Update the model when a connection is established and bind events for the connection
jsPlumb.bind('connection', function (connection) {
    var target = connection.targetId;
    var targetId = target.substr(0, target.indexOf('-'));
    var targetElement = $('#' + targetId);

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceElement = $('#' + sourceId);

    var model;

    if (sourceElement.hasClass(constants.STREAM)) {
        if (targetElement.hasClass(constants.PASS_THROUGH) || targetElement.hasClass(constants.FILTER) || targetElement.hasClass(constants.WINDOW_QUERY)) {
            model = queryList.get(targetId);
            model.set('from', sourceId);
        }

        else if (targetElement.hasClass(constants.PATTERN)) {
            model = patternList.get(targetId);
            var streams = model.get('from');
            if (streams == undefined) {
                streams = [sourceId]
            }
            else
                streams.push(sourceId);
            model.set('from', streams)
        }
        else if (targetElement.hasClass(constants.JOIN)) {
            model = joinQueryList.get(targetId);
            var streams = model.get('from');
            if (streams == undefined) {
                streams = [sourceId]
            }
            else
                streams.push(sourceId);
            model.set('from', streams);
        }
        else if (targetElement.hasClass(constants.PARTITION)) {
            model = partitionList.get(targetId);
            var newPartitionKey = {'stream': sourceId, 'property': ''};
            var partitionKeys = (model.get('partition'));
            partitionKeys['with'].push(newPartitionKey);

            var connectedQueries = jsPlumb.getConnections({source: target});
            $.each(connectedQueries, function (index, connectedQuery) {
                var query = connectedQuery.targetId;
                var queryID = query.substr(0, query.indexOf('-'));
                var queryElement = $('#' + queryID);
                if (queryElement.hasClass(constants.PASS_THROUGH) || queryElement.hasClass(constants.FILTER) || queryElement.hasClass(constants.WINDOW_QUERY)) {
                    model = queryList.get(queryID);
                    model.set('from', sourceId);
                }
                else if (queryElement.hasClass(constants.JOIN)) {
                    model = joinQueryList.get(queryID);
                    var streams = model.get('from');
                    if (streams == undefined) {
                        streams = [sourceId]
                    }
                    else
                        streams.push(sourceId);
                    model.set('from', streams);
                }
                else if (queryElement.hasClass(constants.PATTERN)) {
                    model = patternList.get(queryID);
                    var streams = model.get('from');
                    if (streams == undefined) {
                        streams = [sourceId]
                    }
                    else
                        streams.push(sourceId);
                    model.set('from', streams)
                }
            });

        }
    }

    else if (sourceElement.hasClass(constants.PARTITION)) {
        var connectedStreams = jsPlumb.getConnections({target: source});
        var streamID = null;
        $.each(connectedStreams, function (index, connectedStream) {
            var stream = connectedStream.sourceId;
            streamID = stream.substr(0, stream.indexOf('-'));
        });
        if (streamID != null) {
            if (targetElement.hasClass(constants.PASS_THROUGH) || targetElement.hasClass(constants.FILTER) || targetElement.hasClass(constants.WINDOW_QUERY)) {
                model = queryList.get(targetId);
                model.set('from', streamID);
            }
            else if (targetElement.hasClass(constants.JOIN)) {
                model = joinQueryList.get(targetId);
                var streams = model.get('from');
                if (streams == undefined) {
                    streams = [streamID]
                }
                else
                    streams.push(streamID);
                model.set('from', streams);
            }
            else if (targetElement.hasClass(constants.PATTERN)) {
                model = patternList.get(targetId);
                var streams = model.get('from');
                if (streams == undefined) {
                    streams = [streamID]
                }
                else
                    streams.push(streamID);
                model.set('from', streams)
            }
        }
    }

    else if (targetElement.hasClass(constants.STREAM)) {
        if (sourceElement.hasClass(constants.PASS_THROUGH) || sourceElement.hasClass(constants.FILTER) || sourceElement.hasClass(constants.WINDOW_QUERY)) {
            model = queryList.get(sourceId);
            model.set('insert-into', targetId);
        }
        else if (sourceElement.hasClass(constants.PATTERN)) {
            model = patternList.get(sourceId);
            model.set('insert-into', targetId);
        }
        else if (sourceElement.hasClass(constants.JOIN)) {
            model = joinQueryList.get(sourceId);
            model.set('insert-into', targetId);
        }
    }

    var connectionObject = connection.connection;
    //add a overlay of a close icon for connection. connection can be detached by clicking on it
    var close_icon_overlay = connectionObject.addOverlay([
        "Custom", {
            create: function () {
                return $('<img src="../images/cancel.png" alt="">');
            },
            location: 0.60,
            id: "close",
            events: {
                click: function () {
                    if (confirm('Are you sure you want to remove the connection?')) {
                        jsPlumb.detach(connectionObject);
                    } else {
                    }
                }
            }
        }
    ]);
    close_icon_overlay.setVisible(false);
    //show the close icon when mouse is over the connection
    connectionObject.bind('mouseover', function () {
        close_icon_overlay.setVisible(true);
    });
    //hide the close icon when the mouse is not on the connection path
    connectionObject.bind('mouseout', function () {
        close_icon_overlay.setVisible(false);
    });
});

// Update the model when a connection is detached
jsPlumb.bind('connectionDetached', function (connection) {

    var target = connection.targetId;
    var targetId = target.substr(0, target.indexOf('-'));
    var targetElement = $('#' + targetId);

    var source = connection.sourceId;
    var sourceId = source.substr(0, source.indexOf('-'));
    var sourceElement = $('#' + sourceId);

    var model;
    var streams;
    if (sourceElement.hasClass(constants.STREAM)) {
        if (targetElement.hasClass(constants.PASS_THROUGH) || targetElement.hasClass(constants.FILTER)
            || targetElement.hasClass(constants.WINDOW_QUERY)) {
            model = queryList.get(targetId);
            if (model != undefined) {
                model.set('from', '');
            }
        }
        else if (targetElement.hasClass(constants.JOIN)) {
            model = joinQueryList.get(targetId);
            if (model != undefined) {
                streams = model.get('from');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream, 1);
                model.set('from', streams);
            }
        }
        else if (targetElement.hasClass(constants.PATTERN)) {
            model = patternList.get(targetId);
            if (model != undefined) {
                streams = model.get('from');
                var removedStream = streams.indexOf(sourceId);
                streams.splice(removedStream, 1);
                model.set('from', streams);
            }
        }
        else if (targetElement.hasClass(constants.PARTITION)) {
            model = partitionList.get(targetId);
            if (model != undefined) {
                var removedPartitionKey = null;
                var partitionKeys = (model.get('partition').with);
                $.each(partitionKeys, function (index, key) {
                    if (key.stream == sourceId) {
                        removedPartitionKey = index;
                    }
                });
                partitionKeys.splice(removedPartitionKey, 1);
                var partitionKeysObj = {'with': partitionKeys};
                model.set('partition', partitionKeysObj);

                var connectedQueries = jsPlumb.getConnections({source: target});
                $.each(connectedQueries, function (index, connectedQuery) {
                    var query = connectedQuery.targetId;
                    var queryID = query.substr(0, query.indexOf('-'));
                    var queryElement = $('#' + queryID);
                    if (queryElement.hasClass(constants.PASS_THROUGH) || queryElement.hasClass(constants.FILTER) || queryElement.hasClass(constants.WINDOW_QUERY)) {
                        model = queryList.get(queryID);
                        if (model != undefined) {
                            model.set('from', '');
                        }
                    }
                    else if (queryElement.hasClass(constants.JOIN)) {
                        model = joinQueryList.get(queryID);
                        if (model != undefined) {
                            streams = model.get('from');
                            var removedStream = streams.indexOf(sourceId);
                            streams.splice(removedStream, 1);
                            model.set('from', streams);
                        }
                    }
                    else if (queryElement.hasClass(constants.PATTERN)) {
                        model = patternList.get(queryID);
                        if (model != undefined) {
                            streams = model.get('from');
                            var removedStream = streams.indexOf(sourceId);
                            streams.splice(removedStream, 1);
                            model.set('from', streams);
                        }
                    }
                });
            }
        }
    }

    else if (sourceElement.hasClass(constants.PARTITION)) {

        var connectedStreams = jsPlumb.getConnections({target: source});
        var streamID = null;
        $.each(connectedStreams, function (index, connectedStream) {
            var stream = connectedStream.sourceId;
            streamID = stream.substr(0, stream.indexOf('-'));
        });
        if (targetElement.hasClass(constants.PASS_THROUGH) || targetElement.hasClass(constants.FILTER)
            || targetElement.hasClass(constants.WINDOW_QUERY)) {
            model = queryList.get(targetId);
            if (model != undefined) {
                model.set('from', '');
            }
        }
        else if (targetElement.hasClass(constants.JOIN)) {
            model = joinQueryList.get(targetId);
            if (model != undefined) {
                streams = model.get('from');
                var removedStream = streams.indexOf(streamID);
                streams.splice(removedStream, 1);
                model.set('from', streams);
            }
        }
        else if (targetElement.hasClass(constants.PATTERN)) {
            model = patternList.get(targetId);
            if (model != undefined) {
                streams = model.get('from');
                var removedStream = streams.indexOf(streamID);
                streams.splice(removedStream, 1);
                model.set('from', streams);
            }
        }
    }
    if (targetElement.hasClass(constants.STREAM)) {
        if (sourceElement.hasClass(constants.PASS_THROUGH) || sourceElement.hasClass(constants.FILTER)
            || sourceElement.hasClass(constants.WINDOW_QUERY)) {
            model = queryList.get(sourceId);
            if (model != undefined) {
                model.set('insert-into', '');
            }
        }
        else if (sourceElement.hasClass(constants.JOIN)) {
            if (targetElement.hasClass(constants.STREAM)) {
                model = joinQueryList.get(sourceId);
                if (model != undefined) {
                    model.set('insert-into', '');
                }
            }
        }
        else if (sourceElement.hasClass(constants.PATTERN)) {
            if (targetElement.hasClass(constants.STREAM)) {
                model = patternList.get(sourceId);
                if (model != undefined) {
                    model.set('insert-into', '');
                }
            }
        }
    }

});

jsPlumb.bind('group:addMember', function (event) {
    var partitionId = $(event.group).attr('id');
    var partition = partitionList.get(partitionId);
    var queries = partition.get('queries');
    if ($(event.el).hasClass(constants.FILTER) || $(event.el).hasClass(constants.PASS_THROUGH) || $(event.el).hasClass(constants.WINDOW_QUERY)) {
        queries.push(queryList.get($(event.el).attr('id')));
        partition.set('queries', queries);
    }
    else if ($(event.el).hasClass(constants.JOIN)) {
        queries.push(joinQueryList.get($(event.el).attr('id')));
        partition.set('queries', queries);
    }
});

/**
 * @function Auto align the diagram
 */
function autoAlign() {

    var graph = new dagre.graphlib.Graph({compound: true});

    graph.setGraph({
        rankdir: "LR"
    });
    graph.setDefaultEdgeLabel(function () {
        return {};
    });

    var nodes = [];
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.STREAM));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PASS_THROUGH));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.FILTER));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.WINDOW_QUERY));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.JOIN));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PATTERN));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.WINDOW_STREAM));
    Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PARTITION));

    nodes.forEach(function (node) {
        graph.setNode(node.id, {width: node.offsetWidth, height: node.offsetHeight});
    });

    var edges = jsPlumb.getAllConnections();
    edges.forEach(function (edge) {
        var target = edge.targetId;
        var source = edge.sourceId;
        var targetId = target.substr(0, target.indexOf('-'));
        var sourceId = source.substr(0, source.indexOf('-'));
        graph.setEdge(sourceId, targetId);
    });

    var groups = [];
    Array.prototype.push.apply(groups, document.getElementsByClassName(constants.PARTITION));
    groups.forEach(function (partition) {
        var children = partition.childNodes;
        children.forEach(function (child) {
            var className = child.className;
            if (className.includes(constants.STREAM) || className.includes(constants.PASS_THROUGH) || className.includes(constants.FILTER) || className.includes(constants.WINDOW_QUERY) || className.includes(constants.JOIN) || className.includes(constants.PATTERN)) {
                graph.setParent(child.id, partition.id);
            }
        });
    });

    dagre.layout(graph);

    graph.nodes().forEach(function (nodeId) {
        var node = graph.node(nodeId);
        var jNode = $("#" + nodeId);

        jNode.css("left", node.x + "px");
        jNode.css("top", node.y + "px");
    });

    console.log(graph._nodes);

    jsPlumb.repaintEverything();

    // var g = new dagre.graphlib.Graph({compound: true});
    // g.setGraph({
    //     rankdir: 'LR'
    // });
    // g.graph().nodeSep = 100;
    // g.setDefaultEdgeLabel(function () {
    //     return {};
    // });
    // var nodes = [];
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.STREAM));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PASS_THROUGH));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.FILTER));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.WINDOW_QUERY));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.JOIN));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PATTERN));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.WINDOW_STREAM));
    // Array.prototype.push.apply(nodes, document.getElementsByClassName(constants.PARTITION));
    //
    // // var nodes = $(".ui-draggable");
    // nodes.forEach(function (node) {
    //     var n = node;
    //     var nodeID = n.id;
    //     g.setNode(nodeID, {width: 120, height: 80});
    // });
    //
    // var edges = jsPlumb.getAllConnections();
    // edges.forEach(function (edge) {
    //     var connection = edge;
    //     var target = connection.targetId;
    //     var source = connection.sourceId;
    //     var targetId = target.substr(0, target.indexOf('-'));
    //     var sourceId = source.substr(0, source.indexOf('-'));
    //     g.setEdge(sourceId, targetId);
    // });
    //
    //
    // var groups = [];
    // Array.prototype.push.apply(groups, document.getElementsByClassName(constants.PARTITION));
    // groups.forEach(function (partition) {
    //     var children = partition.childNodes;
    //     children.forEach(function (child) {
    //         var className = child.className;
    //         if (className.includes(constants.STREAM) || className.includes(constants.PASS_THROUGH) || className.includes(constants.FILTER) || className.includes(constants.WINDOW_QUERY) || className.includes(constants.JOIN) || className.includes(constants.PATTERN)) {
    //             g.setParent(child.id, partition.id);
    //         }
    //     });
    // });
    //
    //
    // // calculate the layout (i.e. node positions)
    // dagre.layout(g);
    // // Applying the calculated layout
    // g.nodes().forEach(function (v) {
    //     $("#" + v).css("left", g.node(v).x + "px");
    //     $("#" + v).css("top", g.node(v).y + "px");
    // });
    //
    // jsPlumb.repaintEverything();


    // ---------------------NOTE THIS SHOULD NOT BE UNCOMMENTED---------------------
    // edges = edges.slice(0);
    // for (var j = 0; j<edges.length ; j++){
    //     var source = edges[j].sourceId;
    //     var target = edges[j].targetId;
    //     jsPlumb.detach(edges[j]);
    //     jsPlumb.connect({
    //         source: source,
    //         target: target
    //     });
    //
    // }
}

/**
 * @function Bind event listeners for the elements that are dropped.
 */
function registerElementEventListeners(newElement) {
    //register event listener to show configuration icons when mouse is over the element
    newElement.on("mouseenter", function () {
        var element = $(this);
        element.find('.element-prop-icon').show();
        element.find('.element-conn-icon').show();
        element.find('.element-close-icon').show();
    });

    //register event listener to hide configuration icons when mouse is out from the element
    newElement.on("mouseleave", function () {
        var element = $(this);
        element.find('.element-prop-icon').hide();
        element.find('.element-conn-icon').hide();
        element.find('.element-close-icon').hide();
    });

    //register event listener to remove the element when the close icon is clicked
    newElement.on('click', '.element-close-icon', function () {
        if (jsPlumb.getGroupFor(newElement)) {
            var queries = partitionList.get(jsPlumb.getGroupFor(newElement)).get('queries');
            var removedQueryIndex = null;
            $.each(queries, function (index, query) {
                if (query.id == $(newElement).attr('id')) {
                    removedQueryIndex = index;
                }
            });
            queries.splice(removedQueryIndex, 1);
            partitionList.get(jsPlumb.getGroupFor(newElement)).set('queries', queries);
            jsPlumb.remove(newElement);
            jsPlumb.removeFromGroup(newElement);
        }
        else {
            jsPlumb.remove(newElement);
        }
    });
}

//------------------------------------------------Drop new elements on canvas-------------------------------------------

function dropStream(newAgent, i, top, left, name) {
    /*
    The node hosts a text node where the Stream's name input by the user will be held.
    Rather than simply having a `newAgent.text(streamName)` statement, as the text function tends to
    reposition the other appended elements with the length of the Stream name input by the user.
    */
    var node = document.createElement("div");
    node.id = i + "-nodeInitial";
    node.className = "streamNameNode";

    //Assign the Stream name input by the user to the textnode to be displayed on the dropped Stream
    var textnode = document.createTextNode(name);
    textnode.id = i + "-textnodeInitial";
    node.appendChild(textnode);

    /*
    prop --> When clicked on this icon, a definition and related information of the Stream Element will be displayed as an alert message
    showIcon --> An icon that elucidates whether the dropped stream element is an Import/Export/Defined stream (In this case: an Import arrow icon)
    conIcon --> Clicking this icon is supposed to toggle between showing and hiding the "Connection Anchor Points" (Not implemented)
    */
    var prop = $('<img src="../images/settings.png" class="element-prop-icon collapse" onclick ="generatePropertiesFormForStreams(this)">');
    newAgent.append(node).append('<img src="../images/cancel.png" class="element-close-icon collapse">').append(prop);
    var finalElement = newAgent;

    /*
    connection --> The connection anchor point is appended to the element
    */
    var connection1 = $('<div class="connectorInStream">').attr('id', i + "-in").addClass('connection');
    var connection2 = $('<div class="connectorOutStream">').attr('id', i + "-out").addClass('connection');


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
        deleteEndpointsOnDetach: true,
        anchor: 'Left'
    });

    jsPlumb.makeSource(connection2, {
        deleteEndpointsOnDetach: true,
        anchor: 'Right'
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
function dropStreamFromQuery(position, id, outStream, streamAttributes) {
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
        source: id + '-out',
        target: elementID + '-in'
    });
    //update the query model with output stream
    var query = queryList.get(id);
    query.set('insert-into', elementID);
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
function dropQuery(newAgent, i, droptype, top, left, text) {
    /*A text node division will be appended to the newAgent element so that the element name can be changed in the text node and doesn't need to be appended...
    ...to the newAgent Element everytime theuser changes it*/
    var node = document.createElement("div");
    node.id = i + "-nodeInitial";
    node.className = "queryNameNode";
    var textnode = document.createTextNode(text);
    textnode.id = i + "-textnodeInitial";
    node.appendChild(textnode);

    if (droptype == constants.PASS_THROUGH || droptype == constants.WINDOW_QUERY || droptype == constants.FILTER) {
        var newQuery = new app.Query;
        newQuery.set('id', i);
        queryList.add(newQuery);
        var propertiesIcon = $('<img src="../images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForQueries(this)">');
        newAgent.append(node).append('<img src="../images/cancel.png" class="element-close-icon collapse">').append(propertiesIcon);
        dropSimpleQueryElement(newAgent, i, top, left);
    }

    else if (droptype == constants.JOIN) {
        var newJoinQuery = new app.JoinQuery;
        newJoinQuery.set('id', i);
        joinQueryList.add(newJoinQuery);
        var propertiesIcon = $('<img src="../images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForJoinQuery(this)">');
        newAgent.append(node).append('<img src="../images/cancel.png" class="element-close-icon collapse">').append(propertiesIcon);
        dropCompleteJoinQueryElement(newAgent, i, top, left);
    }
    else if (droptype == constants.PATTERN) {
        var newPattern = new app.Pattern;
        newPattern.set('id', i);
        patternList.add(newPattern);
        var propertiesIcon = $('<img src="../images/settings.png" class="element-prop-icon collapse" onclick="generatePropertiesFormForPattern(this)">');
        newAgent.append(node).append('<img src="../images/cancel.png" class="element-close-icon collapse">').append(propertiesIcon);
        dropPatternQueryElement(newAgent, i, top, left);
    }
}


/**
 * @function draw the simple query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param top
 * @param left
 * @description allows single input stream and single output stream
 */
function dropSimpleQueryElement(newAgent, i, top, left) {
    var finalElement = newAgent;
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
        maxConnections: 1,
        deleteEndpointsOnDetach: true
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        uniqueEndpoint: true,
        maxConnections: 1,
        deleteEndpointsOnDetach: true
    });

}

/**
 * @function draw the pattern query element ( passthrough, filter and window)
 * @param newAgent
 * @param i
 * @param top
 * @param left
 * @description allows mulitple input streams and single output stream
 *
 */

function dropPatternQueryElement(newAgent, i, top, left) {
    var finalElement = newAgent;
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
        maxConnections: 1
    });
}

/**
 * @function draw the join query element on the canvas
 * @param newAgent
 * @param i
 * @param top
 * @param left
 */
function dropCompleteJoinQueryElement(newAgent, i, top, left) {

    var finalElement = newAgent;
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
        maxConnections: 2
    });

    jsPlumb.makeSource(connectionOut, {
        anchor: 'Right',
        uniqueEndpoint: true,
        maxConnections: 1
    });

}

/**
 * @description draw the partition query on the canvas and add the event listeners for it
 * @param newAgent
 * @param i
 * @param mouseTop
 * @param mouseLeft
 */

function dropPartition(newAgent, i, mouseTop, mouseLeft) {

    var finalElement = newAgent;

    $(finalElement).draggable({
        containment: "container",
        drag: function () {
            jsPlumb.repaintEverything();
            // var connections = jsPlumb.getConnections(this);
            // $.each( connections, function(index,connection){
            //     jsPlumb.repaint(connection);
            // });
        }
    });
    var x = 1;
    $(finalElement).resizable();

    finalElement.css({
        'top': mouseTop,
        'left': mouseLeft
    });
    var connectionIn;
    $(finalElement).on('dblclick', function () {
        connectionIn = $('<div class="connectorInPart" >').attr('id', i + '-pc' + x);
        finalElement.append(connectionIn);
        //
        jsPlumb.makeTarget(connectionIn, {
            anchor: 'Left',
            maxConnections: 1
        });
        jsPlumb.makeSource(connectionIn, {
            anchor: 'Right'
        });

        x++;
        $(connectionIn).on('click', function (endpoint) {
            generatePartitionKeyForm(endpoint);
        });
    });

    $('#container').append(finalElement);
    jsPlumb.addGroup({
        el: document.getElementById(i),
        id: i,
        droppable: true,
        constrain: true,
        dropOverride: false,
        draggable: false
    });

    var newPartition = new app.Partition;
    newPartition.set('id', i);
    partitionList.add(newPartition);

}

// ------------------------------------Drop elements ends------------------------------------

/**
 * @function Drop a window stream on the canvas
 * @param newAgent
 * @param i
 * @param topP
 * @param left
 * @param asName
 */
// TODO: not updated
function dropWindowStream(newAgent, i, topP, left, asName) {
    /*
    The node hosts a text node where the Window's name, input by the user will be held.
    Rather than simply having a `newAgent.text(windowName)` statement, as the text function tends to
    reposition the other appended elements with the length of the Stream name input by the user.
    */
    var windowNode = document.createElement("div");
    windowNode.id = i + "-windowNode";
    windowNode.className = "windowNameNode";
    var windowTextnode = document.createTextNode(asName);   //Initially the asName will be "Window" as the has not yet initialized the window
    windowTextnode.id = i + "-windowTextnode";
    windowNode.appendChild(windowTextnode);

    var prop = $('<img src="../images/settings.png" class="element-prop-icon collapse" onclick="">').attr('id', (i + ('-prop')));
    newAgent.append(windowNode).append('<img src="../images/cancel.png" class="element-close-icon collapse">').append(prop);
    var finalElement = newAgent;

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
        maxConnections: 1
    });
    jsPlumb.makeSource(connectionOut, {
        anchor: 'Continuous'
    });

}
