var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../dataModel/userModel');
var Profile = require('../dataModel/profileModel');
var nodemailer = require('nodemailer');
crypto.DEFAULT_ENCODING = 'binary';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bocerapp@gmail.com',
        pass: 'ajosojhzjfuvaihh'
    }
});

router.post('/addUser', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var currentTime = new Date();

	var newUser = User({
		username:username,
		password:password,
		firstName:firstName,
		lastName:lastName,
		createDate:currentTime
	});

	var newProfile = Profile({
		user_id: newUser._id,
		username:username,
		firstName:firstName,
		lastName:lastName
	});
	
	newUser.save(function(err){
		var out = {
		'Target Action':'signupresult',
		'content':''};
		if(err){
			if(err.code===11000){
				out.content='exist';
			}else{
				out.content='fail';
			}
		}
		else{
			out.content='success';
			newProfile.save(function(err){
				if(err) out.content = 'fail';
			});
		}
		res.send(out);
	});
});

router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var out = {
		'Target Action':'loginresult',
		'content':''
		};
	User.findOne({username:username},function(err,user){
		if(err)
			out.content='fail';
		else if(!user){
			out.content='wrong';
		}else{
			user.comparePwd(password,function(isMatch){
				if(isMatch) {out.content='success';}
				else{out.content='wrong';}
			});
		}
		res.send(out);
	})
});

router.post('/checkFacebook', function(req,res){
	var username = req.body.username;

	var out = {
		'Target Action':'facebookresult',
		'content':''
	};
	User.findOne({username:username},function(err,user){
		if(err){
			out.content = 'fail';
		}else if(!user){
			out.content = 'not exist';
		}else{
			out.content='success';
		}
		res.send(out);
	});
});

router.post('/forgetPassword', function(req,res){
	var username = req.body.username;
	var out = {
		'Target Action':'forgetresult',
		'content':''
	}
	User.findOne({username:username},function(err,user){
		if(err){
			out.content = 'fail';
			res.send(out);
		}else if(!user){
			out.content = 'not exist';
			res.send(out);
		}else{
			var token = crypto.randomBytes(20).toString('hex');
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate()+1);

			user.resetPwdToken = token;
			user.resetPwdExpire = tomorrow;

			user.save(function(err){
				if(err) {out.content='fail';res.send(out);}
				else{
					transporter.sendMail({
						from: 'bocerapp@bocerapp.com',
	    				to: user.username,
	    				subject: 'Reset Password for Bocer APP',
	    				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
	          	'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
	          	'http://' + req.headers.host + '/reset/' + token + '\n\n' +
	          	'If you did not request this, please ignore this email and your password will remain unchanged.\n'
						}, function(err,info){
						if(err) out.content='fail';
						else{
							out.content='success';	
						}
						res.send(out);
					});
				}
			});
		}
	})
});
router.get('/reset/:token',function(req,res){
	var token = req.params.token;
	var now = new Date();
	User.findOne({resetPwdToken:token, resetPwdExpire:{$gt:now}},function(err,user){
		if(err){res.render('reset', {result:'fail'});}
		else if(!user){
			res.render('reset',{result:'error'});
		}else{
			res.render('reset',{result:'found'});
		}
	});
});
router.post('/reset/:token',function(req,res){
	var token = req.params.token;
	User.findOne({resetPwdToken:token, resetPwdExpire:{$gt:Date.now()}},function(err,user){
		if(err){res.render('reset', {result:'fail'});}
		else if(!user){
			res.render('reset',{result:'error'});
		}else{
			var password = req.body.password;
			user.password = crypto.createHash('md5').update(password).digest('hex');
			user.resetPwdToken = undefined;
			user.resetPwdExpire = undefined;
			user.save(function(err){
				if(err){
					res.render('reset',{result:'fail'});
				}else{
					res.render('reset',{result:'success'});
				}
			});
		}
	});
});
module.exports = router;