var express = require('express');
var router = express.Router();
var Listing = require('../dataModel/listingModel');
var bookdb = require('google-books-search');

//create a new listing
//by google book id
router.post('/createListing', function(req,res){
	var google_id = req.body.id;
	var username = req.body.username;
	var image = req.body.imagestring;
	var price = req.body.price;
	var real_price = req.body.real_price;
	var state = req.body.state;
	var out = {
		'Target Action':'createListingresult',
		'content':''
	};
	bookdb.lookup(id,function(err,result){
		if(err){
			out.content = 'fail';
			res.send(out);
		}
		else{
			var title = result.title;
			var authors = result.authors;
			var newListing = Listing({
				username:username,
				title:title,
				authors:authors,
				google_id:google_id,
				image:image,
				price:price,
				real_price:real_price,
				state:state
			});
			newListing.save(function(err){
				if(err){
					out.content = 'fail';
					res.send(out);
				}
				else{
					out.content = 'success';
					res.send(out);
				}
			});
		}
	});
});

//modify a listing
//by listing id
//change:
//	price, is_valid, is_deleted, image
router.post('/modifyListing', function(req,res){
	var listing_id = req.body.listing_id;
	var price = req.body.price;
	var real_price = req.body.price;
	var is_valid = req.body.is_valid;
	var is_deleted = req.body.is_deleted;
	var image = req.body.image;
	var out = {
		'Target Action':'modifyListingresult',
		'content':''
	}
	Listing.modify({listing_id:listing_id},{$set:{price:price,real_price:real_price,is_valid:is_valid,is_deleted:is_deleted,image:image}},function(err){
		if(err){
			out.content = 'fail';
		}
		else{
			out.content = 'success';
			res.send(out);
		}
	});
});

//fetch listing
//by username
//by listing id
//by google book id and school name
//by school only
router.post('/fetchListing', function(req,res){
	var method_flag = req.body.method_flag;
	var out = {
		'Target Action':'fetchListingresult',
		'content':''
	};
	if(method_flag == 'u'){
		var username = req.body.username;
		Listing.findOne({username:username},function(err,result){
			if(err){
				out.content = 'fail';
			}
			else{
				out.content = result;
				res.send(out);
			}
		});
	}
	else if(method_flag == 'l'){
		var listing_id = req.body.listing_id;
		Listing.findOne({listing_id:listing_id},function(err,result){
			if(err){
				out.content = 'fail';
			}
			else{
				out.content = result;
				res.send(out);
			}
		});
	}
	else if(method_flag == 'g'){
		var google_id = req.body.google_id;
		var school = req.body.school;
		Listing.findOne({google_id:google_id,school:school},function(err,result){
			if(err){
				out.content = 'fail';
			}
			else{
				out.content = result;
				res.send(out);
			}
		})
	}
	else if(method_flag == 's'){
		var school = req.body.school;
		Listing.findOne({},function(err,result){
			if(err){
				out.content = 'fail';
			}
			else{
				out.content = result;
				res.send(out);
			}
		});
	}
});


module.exports=router;