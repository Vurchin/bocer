var express = require('express');
var Admin = require('../dataModel/adminModel');
var router = express.Router();

/* GET admin page. */
router.get('/', function(req, res, next) {
	res.render('admin');
});
router.post('/',function(req,res){
  var user_name=req.body.user;
  	var password=req.body.password;
  	Admin.find({user:user_name},function(err,user){
      if(err){
        res.send('error');
      }
  		if(user[0].password==password){
  			res.render("index",{title:'Bocer'});
  		}else{
  			res.send('fail');
  		}
  	});
});

module.exports = router;