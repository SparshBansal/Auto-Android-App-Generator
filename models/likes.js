let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let likesSchema = Schema({
    userId: {type: Schema.Types.ObjectId},
    appId: {type: Schema.Types.ObjectId},
    postId: {type: Schema.Types.ObjectId}
});

module.exports = likesSchema;