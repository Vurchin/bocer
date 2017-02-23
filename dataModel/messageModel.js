var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var messageSchema = new Schema({
    from:{type:String, require:true},
    to:{type:String, require:true},
    content:{type:String},
    image:{type:String},
    createDate:{type:String, require:true},
    is_deleted: Boolean},
			       {
				   collection:'messages'
			       });

messageSchema.pre('save',function(next){
        this.is_deleted = false;
        next();
});

var Message = mongoose.model('Message',messageSchema);

module.exports=Message;
