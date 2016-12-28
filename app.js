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
  "DATABASE" : "bocerapp"
}
var dbpath = "mongodb://"+config.USER + ":"+
            config.PASS + "@"+
            config.HOST + ":"+
            config.PORT + "/"+
            config.DATABASE;

var db = mongoose.connect(dbpath);

var routes = require('./routes/index');
var admin = require('./routes/admin');
var login = require('./routes/login');
var profile = require('./routes/profile');
var book = require('./routes/book');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
app.use('/admin',admin);


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


module.exports = app;
