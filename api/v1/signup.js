var express = require('express');
var User = require('../../models/user');

var router = express.Router();

router.post('/' , function(req,res){

	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var mobile = req.body.mobile;

	User.findOne({'local.email' : email}).exec().then(function(user){
		if(user){
			res.json({message : 'SignUp Unsuccusfull , User Already exists' , statusCode : 400});
			return null;
		}
		else{
			var newUser = new User();

			newUser.local.email = email;
			newUser.local.username = username;
			newUser.local.password = password;
			newUser.local.mobile = mobile;
			
			return newUser.save();
		}
	}).then(function(user){
		if(user){
			return res.json({'message' : 'Signup Successfull'} , statusCode : 200 , _id : user._id);
		}
		return;
	}).catch(function(error){
		console.log(error);
		return res.json({'message': "Signup Failed , Server Error"} , statusCode : 500);
	});
});

module.exports = router;