/**
 * Created by pamoda on 11/3/16.
 */
var app = {}; // create namespace for our app
app.Stream = Backbone.Model.extend({
    defaults: {
        id : '',
        name: ''
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
        inStream: [ ],
        outStream: [ ]
    }
});


//--------------
// Collections
//--------------
app.StreamList = Backbone.Collection.extend({
    model: app.Stream,
    localStorage: new Store("backbone-stream")
});

app.ReceiverList = Backbone.Collection.extend({
    model: app.Receiver,
    localStorage: new Store("receivers")
});

app.PublisherList = Backbone.Collection.extend({
    model: app.Publisher,
    localStorage: new Store("backbone-publisher")
});
app.ExecutionPlanList = Backbone.Collection.extend({
    model: app.Publisher,
    localStorage: new Store("executionPlan")
});
streamList = new app.StreamList();
receiverList = new app.ReceiverList();
publisherList = new app.PublisherList();
executionPlanList = new app.ExecutionPlanList();
