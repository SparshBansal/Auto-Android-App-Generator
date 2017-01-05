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

// Google Sign In Routes
router.post('/google', passport.authenticate('local-google'), function(req,res){
	if(req.isAuthenticated()){
		return res.send({redirect : '/createApp'});
	}
	else{
		return res.send({redirect : '/login'});
	}
});

// Facebook Sign In Routes
router.get('/facebook',passport.authenticate('facebook' , {scope : 'email'}));

router.get('/facebook/callback',passport.authenticate('facebook',{
	successRedirect : '/createApp',
	failureRedirect : '/login'
}));

module.exports = router;