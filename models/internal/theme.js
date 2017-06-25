/**
 * Created by sparsh on 6/23/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let themeSchema = Schema({
    name : {type : String , required : true},
    eventType : {type: String , required : true},
    assetPath : {type : String, required : true},
    replaceFile : [String]
});

module.exports = mongoose.model("themes" , themeSchema);
