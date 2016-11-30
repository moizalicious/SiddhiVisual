var flow = {}; // create namespace for our app
flow.Stream = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    }
});

flow.StreamsList = Backbone.Collection.extend({
    model: flow.Stream,
    localStorage: new Store("streams")
});
// instance of the Collection
flow.streamsList = new flow.StreamsList();

flow.StreamTemplate = _.template(
    "<div class='streamNameNode'>Stream</div>"+
    "<a class='boxclose'><b><img src='../Images/Cancel.png'></b></a>"+
    "<img src='../Images/connection.png' class='showIconDefined'>"+
    "<a><b><img src='../Images/settings.png' class='settingsIconLoc'></b></a>"+
    "<div class='connectorInExecutionPlan'></div>"+
    "<div class='connectorOutExecutionPlan'></div>"
    // "</div>"
);

flow.StreamView = Backbone.View.extend({
    template : flow.StreamTemplate,
    initialize: function(){
        this.render();
    },
    render: function(){
        $(this.el).addClass('streamdrop')
            .html(this.template(this.model.toJSON));
        $("#container").append(this.el);
        jsPlumb.draggable(this.el);
        var connectionIn = $(this.el).find('.connectorInExecutionPlan');
        var connectionOut =$(this.el).find('.connectorOutExecutionPlan');
        jsPlumb.addEndpoint(connectionOut,{
            isTarget : true,
            isSource : true,
            endpoint : "Dot",
            anchor : 'Right',
            maxConnections : -1
        });
    }
});
var AppView = Backbone.View.extend({
    // el - stands for element. Every view has a element associate in with HTML
    //      content will be rendered.
    el: '#container',
    // It's the first function called when this view it's instantiated.
    initialize: function(){
        this.render();
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions
    //       to push content. Like the Hello World in this case.
    render: function(){
        this.$el.html("Hello World");
    }
});

jsPlumb.ready(function () {
    // jsPlumb.Defaults.Container = $("#container");
    jsPlumb.Defaults.PaintStyle = {strokeStyle: "darkblue", lineWidth: 2, dashstyle: '3 3'}; //Connector line style
    jsPlumb.Defaults.EndpointStyle = {radius: 7, fillStyle: "darkblue"}; //Connector endpoint/anchor style
    jsPlumb.importDefaults({Connector: ["Bezier", {curviness: 50}]}); //Connector line style
    jsPlumb.setContainer($('#container'));
    var canvas = $('#container');

    $(".stream").draggable
    ({
        helper: 'clone',
        cursor: 'pointer',
        tolerance: 'fit',
        revert: true
    });

    canvas.droppable({
        accept: '.stream, .receiver, .publisher, .execution-plan',
        containment: 'container',
        drop: function (e, ui) {
            var mouseTop = e.pageY - canvas.offset().top;
            var mouseLeft = e.pageX - canvas.offset().left;
            var dropElem = ui.draggable.attr('class');
            //Clone the element in the toolbox in order to drop the clone on the canvas
            droppedElement = ui.helper.clone();
            //To further manipulate the jsplumb element, remove the jquery UI clone helper as jsPlumb doesn't support it
            ui.helper.remove();
            $(droppedElement).removeAttr("class");
            $(droppedElement).draggable({containment: "container"});
            //Repaint to reposition all the elements that are on the canvas after the drop/addition of a new element on the canvas
            jsPlumb.repaint(ui.helper);
            $(droppedElement).draggable({containment: "container"});
            var model = new flow.Stream;
            var view = new flow.StreamView({model:model , mouseLeft: mouseLeft, mouseTop:mouseTop});
        }
    });
});