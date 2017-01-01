var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session

	passport.serializeUser(function(user,done){
		console.log("Serializing!!");
		done(null,user);
	});

	passport.deserializeUser(function(obj,done){
		console.log("Deserializing!!");
		done(null,obj);
	});


	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup',new LocalStrategy({
    	passReqToCallback : true ,
    	 usernameField : 'email' , 
    	 passwordField : 'password'
    	},

    	// Authentication function
    	function(req,username,password,done){

			var username = req.body.username;
			var password = req.body.password;
			var email = req.body.email;
			var mobile = req.body.mobile;

			User.findOne({'local.email' : email}).exec().then(function(result){

				if(result){
					// User already exists
					console.log("User already exists");
					return(null);
				}
				else{
					console.log("No existing user");
					// No existing user with this email , create one
					var newUser = new User();

					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.email = email;
					newUser.local.mobile = mobile;
					
					return newUser.save();
				}
			}).then(function(user){

				if(!user){
					done(null,false);
				}else if(user){
					done(null,user);
				}

			}).catch(function(error){
				
				console.log(error.body);
			
			});	
		}
	));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local

	passport.use('local-login',new LocalStrategy({

		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	
	}, function(req,email,password,done){

		User.findOne({'local.email' : email}).exec().then(function(user){
			
			if(!user){
				console.log("Invalid Email Address");
				return done(null,false);
			}
			else if(user){
				if(user.checkPassword(password)){
					console.log("Signed In!!");
					return done(null,user);
				}
				else{
					console.log("Invalid Password");
					return done(null,false);
				}
			}
	
		}).catch(function(error){
	
			return console.log(error.body);
	
		});
	}));

};
