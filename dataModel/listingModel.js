	var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var listingSchema = new Schema({
	username:{type:String,ref:'User'},
	title:{type:String, require:true},
	google_id:{type:String,require:true},
	school:{type:String},
	author:{type:String},
	edition:{type:String},
	userimage:{type:String},
	small_image:{type:String},
	big_image:[String],
	price:{type:String, require:true},
	real_price:{type:String, require:true},
	state:{type:String, default:0}, //can be 1 2 3 4 5
	description:{type:String},
	createDate: Date,
	not_sold: Boolean, //sell or not
	is_deleted: Boolean}, //deleted by user or sold
	{
		collection:'listings'
	});

listingSchema.pre('save',function(next){
	var date = new Date();
	this.createDate = date;
	this.not_sold = true;
	this.is_deleted = false;

	next();
});


var Listing = mongoose.model('Listing',listingSchema);

module.exports=Listing;