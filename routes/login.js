let express = require('express');
let passport = require('passport');
let router = express.Router();

router.get('/', function (req, res, next) {
    return res.render('login.ejs', {});
});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/createApp',
    failureRedirect: '/login',
    failureFlash: true
}));


// Google Sign In Routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', function (req, res, next) {
    console.log("GOT the request");
    next();
}, passport.authenticate('google', {
    successRedirect: '/createApp',
    failureRedirect: '/login'
}));

// Facebook Sign In Routes
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/createApp',
    failureRedirect: '/login'
}));

module.exports = router;