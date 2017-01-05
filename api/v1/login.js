var express = require('express');
var type = require('./loginType');

var User = require('../../models/user');

var router = express.Router();

router.post('/',function(req,res){

	console.log(req.body);

	var loginType = req.body.type;
	var username = req.body.key_username;

	switch(loginType){

		// Handle local login
		case type.local:
			User.findOne({'local.email' : username}).exec().then(function(user){
				if(!user){
					return res.json({'message' : 'Login Unsucessful , Invalid Email ID' , 'statusCode' : 400 });
				}
				else if(user){
					var password = req.body.key_password;
					if(user.checkPassword(password)){
						console.log("Logged In");
						return res.json({'message' : 'Login Successful' , 'statusCode' : 200 , '_id' : user._id});
					}
					else{
						console.log("Password incorrect");
						return res.json({'message' : 'Login Unsucessful , Invalid Password' , 'statusCode' : 400});
					}
				}
			}).catch(function(error){
				return res.json({'message' : "Login Unsucessful , Server Error" , 'statusCode' : 500});
			});
			break;
		
		// Handle google login
		case type.google:
			var profileId = req.body.profileId;
			User.findOne({'google.id' : profileId}).exec().then(function(user){
				if(user){
					return user;
				}
				else{

					var accessToken = req.body.accessToken;

					var newUser = newUser();
					newUser.google.name = username;
					newUser.google.email = email;
					newUser.google.token = accessToken;
					newUser.google.id = profileId;

					return newUser.save();
				}
			}).then(function(user){
				return res.json({'message' : "Login Successful" , statusCode : 200 , _id : user._id});
			}).catch(function(error){
				return res.json({'message' : "Login Unsucessful , Server Error" , statusCode : 500});
			});
			break;

		// Handle Facebook Login
		case type.facebook:
			var profileId = req.body.profileId;
			User.findOne({'facebook.id' : profileId}).exec().then(function(user){
				if(user){
					return user;
				}
				else{

					var accessToken = req.body.accessToken;

					var newUser = newUser();
					newUser.facebook.name = username;
					newUser.facebook.email = email;
					newUser.facebook.token = accessToken;
					newUser.facebook.id = profileId;

					return newUser.save();
				}
			}).then(function(user){
				return res.json({'message' : "Login Successful" , statusCode : 200 , _id : user._id});
			}).catch(function(error){
				return res.json({'message' : "Login Unsucessful , Server Error" , statusCode : 500});
			});
			break;

		case type.twitter:
			break;
	}
});

module.exports = router;