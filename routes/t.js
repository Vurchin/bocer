var socket = require('socket.io');

var express = require('express');

var http = require('http');

var app = express();

var server = http.createServer(app).listen(8000, function(err) {
    if(err) console.log(err.stack);
});

var io = socket.listen(server);

console.log("running");

var socket_list = {};

io.sockets.on('connection', function(socket) {
    var data = socket.request;
    var username = data._query['foo'];
    console.log("here");
    socket.on('disconnect', function() {
        console.log(username);
        console.log('disconnected');

    });

});
