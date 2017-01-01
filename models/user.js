var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local : {
		username : String,
		password : String,
		email : String,
		mobile :  String
	},
	facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

var SALT_FACTOR = 10;
var noop = function(){};

// Generate the hash
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password , bcrypt.genSaltSync(SALT_FACTOR) , null);
}

/*userSchema.pre('save' , function(done){
	var user = this;	
	bcrypt.genSalt(SALT_FACTOR,function(error,salt){
		if(error){
			return done(error);
		}
		bcrypt.hash(user.password,salt,noop,function(error,hashedPassword){
			if(error){
				done(error);
			}
			user.password = hashedPassword;
			done();
		});
	});
});*/

// Comparing the passwords 
userSchema.methods.checkPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
};

module.exports = mongoose.model('user',userSchema);