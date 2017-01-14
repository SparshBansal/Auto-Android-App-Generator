var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = Schema({
	appId : {type : Schema.Types.ObjectId , required : true},
	userId : {type : Schema.Types.ObjectId , required : true},
	mimeType : {type : String},
	createdAt : {type : Date, default: Date.now },
	locationUri : {type : String},
	description : {type : String},
	likes : {type : Number},
	comments : []
});

module.exports = mongoose.model('post' , postSchema);