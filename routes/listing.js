var express = require('express');
var router = express.Router();
var Listing = require('../dataModel/listingModel');
var Profile = require('../routes/profile');
var bookdb = require('google-books-search');

//create a new listing
//by google book id
router.post('/createListing', function(req,res){
	var google_id = req.body.id;
	var username = req.body.username;
	var school = req.body.school;
	var title = req.body.title;
	var author = req.body.author;
	var userimage = req.body.userimage;
	var small_image = req.body.small_image;
	var big_image = req.body.big_image;
	var edition = req.body.edition;
	var price = req.body.price;
	var real_price = req.body.real_price;
	var state = req.body.state;
	var description = req.body.description;
	var out = {
		'Target Action':'createListingresult',
		'content':''
	};
	var newListing = Listing({
		username:username,
		title:title,
		google_id:google_id,
		school:school,
		author:author,
		edition:edition,
		userimage:userimage,
		small_image:small_image,
		big_image:big_image,
		price:price,
		real_price:real_price,
		state:state,
		description:description
	});
	newListing.save(function(err){
		if(err){
			out.content = 'fail';
			console.log(err);
			res.send(out);
		}
		else{
			out.content = 'success';
			res.send(out);
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

//fetch listing by title, author and school name
router.post('/fetch_listing_by_author',function(req,res){
	var title = req.body.title;
	var author = req.body.author;
	var school = req.body.school;
	var out = {
		'Target Action':'fetchlistingbyauthorresult',
		'content':''
		// 'listing_id':'',
		// 'title':'',
		// 'author':'',
		// 'edition':'',
		// 'userimage':'',
		// 'booksmallimage':'',
		// 'realprice':'',
		// 'state':'',
		// 'description':''
	};
	//searchListing
	// Listing.find({title:title,author:author,school:school},function(err,result){
	// 	if(err){
	// 		out.content = 'fail';
	// 		console.log(err);
	// 		res.send(out);
	// 	}
	// 	else{
	// 		if(result){
	// 			out.content = result;
				
	// 			res.send(out);
	// 		}
	// 		else{
	// 			out.content = 'empty';
	// 			res.send(out);
	// 		}
	// 	}
	// });	
	//search Listings
	Listing.find({title:title,author:author,school:school}).lean().exec(function(err,result){
		if(err){
			out.content = 'fail';
			console.log(err);
			res.send(out);
		}
		else{
			if(result){
				out.content = result;
				console.log(result);
				res.send(out);
			}
			else{
				out.content = 'empty';
				res.send(out);
			}
		}
	});
});


//fetch listing
//by username
//by listing id
//by title and author id and school name
//by school only
router.post('/fetchListing', function(req,res){
	var method_flag = req.body.method_flag;
	var out = {
		'Target Action':'fetchListingresult',
		'content':'',
		
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
	else if(method_flag == 'ta'){
		var title = req.body.title;
		var author = req.body.author;
		var school = req.body.school;
		Listing.findOne({title:title,author:author,school:school},function(err,result){
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