var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = Schema({
	userId : {type : Schema.Types.ObjectId},
	appId : {type : Schema.Types.ObjectId},
	postId : {type : Schema.Types.ObjectId},
	comment : {type : String , required : true},
	timestamp : {type : Date , default : Date.now()},
	likes : {type: Number},
	reply : {type : []}
});

module.exports = mongoose.model('comment',commentSchema);