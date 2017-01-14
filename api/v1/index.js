var express = require('express');
var loginRouter = require('./login');
var signupRouter = require('./signup');
var router = express.Router();

router.use('/login',loginRouter);
router.use('/signup',signupRouter);

module.exports = router;