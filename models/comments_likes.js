var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comments_Likes_schema = Schema({
    userId: {type: Schema.Types.ObjectId},
    appId: {type: Schema.Types.ObjectId},
    commentId: {type: Schema.Types.ObjectId},
});

module.exports = comments_Likes_schema;