var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var bookSchema = new Schema({
	user_id:{type:Schema.ObjectId,ref:'User'},
	title:{type:String, require:true},
	author:{type:String, require:true},
	edition:{type:String},
	image:[String], //may just contain 3 images
	className:{type:String},
	price:{type:Number, require:true},
	real_price:{type:Number, require:true},
	loc:{type:String, require:true},
	state:{type:Number, default:0},
	createDate: Date,
	is_deleted: Boolean},
	{
		collection:'books'
	});

bookSchema.pre('save',function(next){
	var date = new Date();
	this.createDate = date;
	this.is_deleted = false;

	next();
});


var Book = mongoose.model('Book',bookSchema);

module.exports=Book;