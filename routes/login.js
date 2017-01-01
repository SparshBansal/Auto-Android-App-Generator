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

router.post('/google', passport.authenticate('local-google'), function(req,res){
	if(req.isAuthenticated()){
		return res.send({redirect : '/createApp'});
	}
	else{
		return res.send({redirect : '/login'});
	}
});

module.exports = router;