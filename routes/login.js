var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/',function(req,res,next){
	return res.render('login.ejs',{});
});

router.post('/',passport.authenticate('local-login',{
	successRedirect : '/createApp',
	failureRedirect : '/login',
	failureFlash : true
}));

module.exports = router;