let express = require('express');
let passport = require('passport');
let mongoose = require('mongoose');

let router = express.Router();

router.get('/', function (req, res, next) {
    res.render('signup.ejs', {});
    console.log(mongoose.connection.readyState);
});

router.post('/', function (req, res, next) {
        console.log("Got the signup request");
        next();
    },

    // Authenticate with passport
    passport.authenticate('local-signup', {
        successRedirect: '/createApp',
        failureRedirect: '/signup',
        failureFlash: true
    })
);

module.exports = router;