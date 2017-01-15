var express = require('express');
var loginRouter = require('./login');
var signupRouter = require('./signup');
var fetchPostRouter = require('./post');
var router = express.Router();

router.use('/login',loginRouter);
router.use('/signup',signupRouter);
router.use('fetchpost',fetchPostRouter);


module.exports = router;