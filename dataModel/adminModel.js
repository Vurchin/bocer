var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	user: {type:String, required:true, unique:true},
	password: {type: String, required:true}
},{collection:'admins'});


var Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;