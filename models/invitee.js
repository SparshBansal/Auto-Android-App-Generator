var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var inviteeSchema = Schema({

    appId: {type: Schema.Types.ObjectId},
    inviteeId: {type: Schema.Types.ObjectId},
    going: {type: Boolean}

});