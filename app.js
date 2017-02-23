var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var os = require('os');
var assert = require('assert');

var config = {
  "USER"    : "",           
  "PASS"    : "",
  "HOST"    : "localhost", 
  "PORT"    : "27017", 
  "DATABASE" : "bocer"
};
var dbpath = "mongodb://"
              + config.HOST
              + ":"
              + config.PORT
              + "/"
              + config.DATABASE;

var db = mongoose.connect(dbpath);

var routes = require('./routes/index');
var admin = require('./routes/admin');
var login = require('./routes/login');
var profile = require('./routes/profile');
var book = require('./routes/book');
var listing = require('./routes/listing');
var school = require('./routes/school');
//message
var Message = require('./dataModel/messageModel');

var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//functions for randering page and handle request
app.use('/', routes);
app.use('/', login);
app.use('/', profile);
app.use('/', book);
app.use('/',listing);
app.use('/',school);
app.use('/admin',admin);

app.post('/get',function(req,res){
    console.log(req.body);
    out = {
	'content':'good'
    };
    res.send(out);
})

//settings for messager
var server = http.createServer(express).listen(8080, function(err) {
    if(err) console.log(err.stack);
});

var io = socket.listen(server);

var socket_map = {}; //store the username and socket ids

io.sockets.on('connection', function(socket) {
    console.log('connect');
    var	data = socket.request;
    var	username = data._query['email'];
    console.log(username);
    var socketid = socket.id;
    if(socket_map[username]){
	socket_map[username].push(socketid);
    }
    else{
	var list = [];
	list.push(socketid);
	socket_map[username] = list;
    }
    //push message to socket
    
    
    
    
    socket.emit('message',out);
    //end test
    socket.on('disconnect', function() {
	var idx = socket_map[username].indexOf(socketid);
	socket_map[username].splice(idx,1);
    });
});

app.post('/message',function(req,res){
    var from = req.body.from;
    var to = req.body.to;
    var message = req.body.message;
    var image = req.body.image;
    var date = req.body.date;
    var out = {
	'from':from,
	'message':message,
	'image':image,
	'date':date
    };
    if(socket_map[to] && socket_map[to].length != 0){
	for(var idx = 0; idx < socket_map[to].length; idx++){
	    io.sockets.connected[socket_map[to][idx]].emit('message', out);
	}
    }
    else{
	var newMessage = Message({
	    from:from,
	    to:to,
	    content:message,
	    image:image,
	    createDate:date
        });
	newMessage.save(function(err){
	    if(err) console.log(err.stack);
	});
	
    }
});

//end messager settings

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//server starts listen
app.listen((process.env.PORT || 3000),function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log('server running at ' + (process.env.PORT || 3000));
  }
});



module.exports = app;
