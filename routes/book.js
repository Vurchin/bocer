var express = require('express');
var router = express.Router();
var bookdb = require('google-books-search');

var options = {
    key: "AIzaSyBluikCkntx_5RLH2GZOAY95KhybSOrxyQ",
    type: 'books',
};

//search book by anything
//will return a large chunk containing the id of books in Google book database
router.post('/searchBook',function(req,res){
	var field = req.body.field;
	var out = {
		'Target Action':'searchBookresult',
		'content':'',
		'bookname':''
	};	
	bookdb.search(field,options,function(err,results){
		if(err){
			out.content = 'fail';
			console.log(err.stack)
			res.send(out);
		}
		else{
			out.content = results;
			out.bookname = field;
			res.send(out);
		}
	});
});


module.exports=router;