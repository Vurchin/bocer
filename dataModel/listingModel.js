var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var listingSchema = new Schema({
	username:{type:String,ref:'User'},
	title:{type:String, require:true},
	google_id:{type:String, require:true},
	authors:[String],
	edition:{type:String},
	image:[String],
	price:{type:Number, require:true},
	real_price:{type:Number, require:true},
	state:{type:Number, default:0}, //can be 0 1 2 3
	createDate: Date,
	is_valid: Boolean,
	is_deleted: Boolean},
	{
		collection:'listings'
	});

listingSchema.pre('save',function(next){
	var date = new Date();
	this.createDate = date;
	this.is_valid = true;
	this.is_deleted = false;

	next();
});


var Listing = mongoose.model('Listing',listingSchema);

module.exports=Listing;