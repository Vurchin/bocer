var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
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
