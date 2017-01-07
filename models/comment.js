var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = Schema({
	comment : {type : String , required : true},
	appId : {type : Schema.Types.ObjectId},
	postId : {type : Schema.Types.ObjectId},
	timestamp : {type : Date , default : Date.now()},
	reply : {type : []}
});

module.exports = mongoose.model('comment',commentSchema);