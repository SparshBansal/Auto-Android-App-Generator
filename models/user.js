let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String,
        email: String,
        mobile: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

let SALT_FACTOR = 10;
let noop = function () {
};

// Generate the hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_FACTOR), null);
};

// Comparing the passwords 
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('user', userSchema);