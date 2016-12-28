var express = require('express');
var router = express.Router();
var Book = require('../dataModel/bookModel');
var User = require('../dataModel/userModel');

/* GET home page. */
router.post('/addbook', function(req, res) {
  	var image = [req.body.image1,req.body.image2,req.body.image3];
  	var loc = [req.body.locationX,req.body.locationY];

  	var out = {
			'Target Action':'addbookresult',
			'content':''};

  	User.findOne({username:req.body.username},function(err,user){
  		if(err){out.content='fail';}
  		else{
  			var newBook = Book({
	  			user_id:user._id,
	  			title:req.body.title,
	  			author:req.body.author,
				edition:req.body.edition,
				ISBN:req.body.ISBN,
				className:req.body.className,
				price:req.body.price,
				image:image,
				loc:loc
	  		});
	  		newBook.save(function(err){
				if(err){
					console.log(err);
					out.content='fail';
				}
				else{
					out.content='success';
				}
				res.send(out);
			});
	  	}	
	});
  	
});

module.exports = router;