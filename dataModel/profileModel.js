var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var profileSchema = new Schema({
	user_id:{type:Schema.ObjectId,ref:'User'},
	username:{type:String, require:true, unique:true},
	firstName:{type:String, require:true},
	lastName:{type:String, require:true},
	image:{type:String},
	createDate: Date,
	is_deleted: Boolean},
	{
		collection:'profiles'
	});

profileSchema.pre('save',function(next){
	var date = new Date();
	this.createDate = date;
	this.is_deleted = false;

	next();
});


var Profile = mongoose.model('Profile',profileSchema);

module.exports=Profile;