var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var likesSchema = Schema
{
    userId : {
        type : Schema.type.ObjectId
    }
,
    appId : {
        type : Schema.type.ObjectId
    }
,
    postId : {
        type : Schema.type.ObjectId
    }
}