var express = require('express');
var app = express();

app.set('port',process.env.PORT || 3000);


app.post('/get',function(req,res){
    console.log("heyhey");
});



app.listen(function(err){
    if(!err) console.log('wdhwd');
})
