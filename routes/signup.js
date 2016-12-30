var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');

var router = express.Router();

router.get('/' , function(req,res,next){
	res.render('signup.ejs',{});
	console.log(mongoose.connection.readyState);
});

router.post('/',passport.authenticate('local-signup',{
	successRedirect : '/createApp',
	failureRedirect : '/signup',
	failureFlash : true
}));

module.exports = router;