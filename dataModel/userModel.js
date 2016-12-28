var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
crypto.DEFAULT_ENCODING = 'binary';

var userSchema = new Schema({
	username:{type:String, require:true, unique:true},
	firstName:{type:String, require:true},
	lastName:{type:String, require:true},
	password:{type:String, require:true},
	salt:{type:String, require:true},
	createDate: Date,
	resetPwdToken:String,
	resetPwdExpire:Date},
	{
		collection:'users'
	});

userSchema.methods.comparePwd = function(entered, callback){
	var hashed = crypto.pbkdf2Sync(entered,this.salt,12000,128).toString('hex');
	var isMatch = (hashed===this.password) ? true:false;
	callback(isMatch);
};


userSchema.pre('save',function(next){
	if(!this.isModified('password')) return next();

	var salt = crypto.randomBytes(256).toString('base64');
	var hashed = crypto.pbkdf2Sync(this.password,salt,12000,128).toString('hex');

	this.salt = salt;
	this.password = hashed;

	next();
});


var User = mongoose.model('User',userSchema);

module.exports=User;