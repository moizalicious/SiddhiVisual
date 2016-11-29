var app = {}; // create namespace for our app

app.Stream = Backbone.Model.extend({
    defaults: {
        id: '',
        define: '',
        type: '',
        attributes: [
            {
                attribute:'',
                type: ''
            }
        ]
    }
});
app.FilterQuery = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        inStream: '',
        outStream: '',
        filter: '',
        attributes: []
    }
});

app.PassThroughQuery = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        inStream: '',
        outStream: '',
        attributes: []
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
        window: '',
        attributes: []
    }
});
//model for all 3 simple queries ( passthrough, window and filter)
app.Query = Backbone.Model.extend({
    defaults: {
        "id": '',
        "name": '',
        "from": '',
        "insert-into": '',
        "filter": '',
        "post-window-query": '',
        "window": '',
        "output-type": '',
        "projection": []
    }
});

app.Pattern = Backbone.Model.extend({
    defaults: {
        "id": '',
        "name": '',
        "states": [],
        "logic": '',
        "projection": [],
        "filter": '',
        "post-window-filter": '',
        "window": '',
        "having": '',
        "group-by": '',
        "output-type": '',
        "insert-into": '',
        //additional attribute for form generation
        "from": []
    }
});

app.JoinQuery = Backbone.Model.extend({

    "join":{
        "type":'',
        "left-stream":{
            "from":'',
            "filter":'',
            "window":'',
            "post-window-query":'',
            "as":''
        },
        "right-stream":{
            "from":'',
            "filter":'',
            "window":'',
            "post-window-query":'',
            "as":''
        },
        "on":''
    },
    "projection":[],
    "output-type": '',
    "insert-into":'',
    //additional attribute for form generation
    "from" : []
});

//--------------
// Collections
//--------------
app.StreamList = Backbone.Collection.extend({
    model: app.Stream
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
app.PatternList = Backbone.Collection.extend({
    model: app.Pattern
});
app.PatternList = Backbone.Collection.extend({
    model: app.Pattern
});
app.JoinQueryList = Backbone.Collection.extend({
    model: app.JoinQuery
});

//initiates the collections
streamList = new app.StreamList();
filterList = new app.FilterList();
passThroughList = new app.PassThroughList();
windowQueryList = new app.WindowQueryList();
queryList = new app.QueryList();
patternList = new app.PatternList();
joinQueryList = new app.JoinQueryList();