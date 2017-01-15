let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let appSchema = mongoose.Schema({

    name: {type: String, required: true},
    adminId: {type: Schema.Types.ObjectId},
    package: {type: String, required: true, unique: true},
    properties: {type: Schema.Types.Mixed}

});

module.exports = mongoose.model('app', appSchema);