var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Listing = require('../dataModel/listingModel')
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


var newListing = Listing({
    username:'yicheng.wang@vanderbilt.edu',
    title:'California',
    google_id:'fake_id',
    school:'Vanderbilt University',
    author:'Kevin Starr',
    edition:'1',
    userimage:'',
    small_image:'',
    real_price:'10',
    state:'1'
});

newListing.save(function(err){
    if(err) console.log(err);
    else{
	Listing.find({title:'California',author:'Kevin Starr',school:'Vanderbilt University'},function(err,result){
	    if(err) console.log('err');
	    else console.log(result);
	    
	});
    }
});

//Listing.find({title:'California','author':'Kevin Starr','school':'Vanderbilt University'},function(err,result){
//    if(err) console.log(err);
//    else{
	
//    }
//});


//Listing.find({title:'California','author':'Kevin Starr','school':'Vanderbilt University'}).lean().exec(function(err,result){
//    if(err) console.log(err);
//    else console.log(result);

    
//});
