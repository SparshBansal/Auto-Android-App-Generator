var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username : {type:String , required : true},
	password : {type:String},
	email : {type : String},
	mobile : {type : String}
});

var SALT_FACTOR = 10;
var noop = function(){};

userSchema.pre('save' , function(done){
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
});

userSchema.methods.checkPassword = function(guess,done){
	bcrypt.compare(guess,this.password,function(error,isMatch){
		done(error,isMatch);
	});
};

module.exports = mongoose.model('user',userSchema);