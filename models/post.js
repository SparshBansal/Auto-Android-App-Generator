var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = Schema({
    appId: {type: Schema.Types.ObjectId, required: true},
    userId: {type: Schema.Types.ObjectId, required: true},
    mimeType: {type: String},
    timsStamp: {type: Number},
    locationUri: {type: String},
    description: {type: String},
    likes: {type: Number},
    comments: []
});

module.exports = mongoose.model('post', postSchema);