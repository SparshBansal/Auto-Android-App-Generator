var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');
var configAuth = require('./auth');

var GoogleAuth = require('google-auth-library');

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

	// =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use('google' , new GoogleStrategy({
    	clientID : configAuth.google.clientId,
    	clientSecret : configAuth.google.clientSecret,
    	callbackURL : configAuth.google.callbackUrl
    },function(token, refreshToken, profile, done){
    	User.findOne({'google.id' : profile.id}).exec().then(function(user){
    		if(user){
    			return user;
    		}
    		else{
    			var newUser = new User();
    			
    			newUser.google.id    = profile.id;
                newUser.google.token = token;
                newUser.google.name  = profile.displayName;
                newUser.google.email = profile.emails[0].value;

                return newUser.save();
    		}
    	}).then(function(user){
    		return done(null,user);
    	}).catch(function(error){
    		console.log(error);
    		return done(error);
    	});
    }));

    // ===========================================================================
    // FACEBOOK ==================================================================
    // ===========================================================================
    passport.use(new FacebookStrategy({
    	clientID : configAuth.facebook.appId,
    	clientSecret : configAuth.facebook.appSecret,
    	callbackURL : configAuth.facebook.callbackUrl,
    	profileFields : ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    	
    }, function(token,refreshToken,profile,done){

    	User.findOne({'facebook.id':profile.id}).exec().then(function(user){
    		if(user){
    			return user;
    		}
    		else{
    			var newUser = new User();
    			
    			console.log(profile);

    			// set all of the facebook information in our user model
                newUser.facebook.id    = profile.id;                    
                newUser.facebook.token = token;                     
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value; 
    			
    			return newUser.save();
    		}
    	}).then(function(user){
    		return done(null,user);
    	}).catch(function(error){
    		console.log(error);
    		done(error);
    	});

    }));
};

