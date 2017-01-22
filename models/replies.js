let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let repliesSchema = Schema({
	userId: {type: Schema.Types.ObjectId},
    appId: {type: Schema.Types.ObjectId},
    commentId: {type: Schema.Types.ObjectId},
    replies: {type: String, required: true},
    timestamp: {type: Date, default: Date.now()},
    likes: {type: []}
});

module.exports = mongoose.model('replies' , repliesSchema);