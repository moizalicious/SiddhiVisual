
var app = {}; // create namespace for our app

app.Stream = Backbone.Model.extend({
    defaults: {
        id : '',
        name: '',
        asName:'',
        type: '',
        attributes:[]
    }
});

app.Receiver = Backbone.Model.extend({
    defaults: {
        id : '',
        name: '',
        stream:''
    }
});

app.Publisher = Backbone.Model.extend({
    defaults: {
        id : '',
        name: '',
        stream:''
    }
});

app.ExecutionPlan = Backbone.Model.extend({
    defaults: {
        id : '',
        name: '',
        inStream: [],
        outStream: []
    }
});

app.FilterQuery = Backbone.Model.extend({
    defaults :{
        id : '',
        name: '',
        inStream:'',
        outStream: '',
        filter: '',
        attributes:[]
    }
});

app.PassThroughQuery = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        inStream: '',
        outStream: '',
        attributes:[]
    }
});

app.WindowQuery = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        inStream: '',
        outStream: '',
        filter1: '',
        filter2: '',
        window:'',
        attributes: []
    }
});
app.Query = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        inStream: '',
        outStream: '',
        filter1: '',
        filter2: '',
        window:'',
        attributes: []
    }
});
//--------------
// Collections
//--------------
app.StreamList = Backbone.Collection.extend({
    model: app.Stream
});

app.ReceiverList = Backbone.Collection.extend({
    model: app.Receiver
});

app.PublisherList = Backbone.Collection.extend({
    model: app.Publisher
});
app.ExecutionPlanList = Backbone.Collection.extend({
    model: app.Publisher
});
app.FilterList = Backbone.Collection.extend({
    model: app.FilterQuery
});
app.PassThroughList = Backbone.Collection.extend({
    model: app.PassThroughQuery
});
app.WindowQueryList = Backbone.Collection.extend({
    model: app.WindowQuery
});
app.QueryList = Backbone.Collection.extend({
    model: app.Query
});

streamList = new app.StreamList();
receiverList = new app.ReceiverList();
publisherList = new app.PublisherList();
executionPlanList = new app.ExecutionPlanList();
filterList = new app.FilterList();
passThroughList = new app.PassThroughList();
windowQueryList = new app.WindowQueryList();
queryList = new app.QueryList();