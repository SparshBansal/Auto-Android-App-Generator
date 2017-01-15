let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let inviteeSchema = Schema({

    appId: {type: Schema.Types.ObjectId},
    inviteeId: {type: Schema.Types.ObjectId},
    going: {type: Boolean}

});