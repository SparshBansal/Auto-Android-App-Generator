let mongoose = require('mongoose');

let eventSchema = mongoose.Schema({
    appId: {type: Schema.Types.ObjectId},
    name: {type: String},
    description: {type: String},
    locationDescription: {type: String},
    date: {type: Date},
    imageUri: {type: String},
    videoUri: {type: String},
    locationCoordinates: {
      lat: {type: Number},
      long: {type: Number}
    }
});

module.exports = mongoose.model('event', eventSchema);
