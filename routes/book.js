var express = require('express');
var router = express.Router();
var bookdb = require('google-books-search');

//search book by anything
//will return a large chunk containing the id of books in Google book database
router.post('/searchBook',function(req,res){
	var field = req.field;
	var out = {
		'Target Action':'searchBookresult',
		'content':''
	};	
	bookdb.search(field,function(err,results){
		if(err){
			out.content = 'fail';
			res.send(out);
		}
		else{
			out.content = results;
			res.send(out);
		}
	});
});


module.exports=router;