var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments_Likes_schema({
	userId: {type: Schema.Types.ObjectId},
    appId: {type: Schema.Types.ObjectId},
    commentId: {type: Schema.Types.ObjectId},
    replies: {type: String, required: true},
    timestamp: {type: Date, default: Date.now()},
    likes: {type: []}
});