let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let likesSchema = Schema({
    userId: {type: Schema.type.ObjectId},
    appId: {type: Schema.type.ObjectId},
    postId: {type: Schema.type.ObjectId}
});

module.exports = likesSchema;