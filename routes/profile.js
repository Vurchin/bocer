var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../dataModel/userModel');
var Profile = require('../dataModel/profileModel');

router.post('/userbasicinfo', function(req,res){
	var username = req.body.username;
	var out ={
		'Target Action':'userbasicinfo',
		'content':'',
		'firstname':'',
		'lastname':'',
		'school':'',
		'imagestring':''
	};
	Profile.findOne({username:username},function(err,doc){
		if(err) out.content = 'fail';
		else{
			out.content = doc;
			res.send(out);
		}
	});
});
//just in case
router.post('/addusersmallimage', function(req,res){
	var username = req.body.username;
	var image = req.body.imagestring;
	var out = {
		'Target Action':'addusersmallimageresult',
		'content':''
	};
	Profile.update({username:username},{$set:{image:image}}, function(err){
		if (err) out.content = 'fail';
		else out.content = 'success';
		res.send(out);
	});
});

router.post('/setuserinfo',function(req,res){
	var username = req.body.username;
	var firstName = req.body.firstname;
	var lastName = req.body.lastname;
	var school = req.body.school;
	var image = req.body.imagestring;
	var out = {
		'Target Action':'setuserinfo',
		'content':''
	};
	Profile.update({username:username},{$set:{school:school,image:image,firstName:firstName, lastName:lastName}}, function(err){
		if (err) out.content = 'fail';
		else out.content = 'success';
		res.send(out);
	});
});

module.exports=router;