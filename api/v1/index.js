var express = require('express');
var loginRouter = require('./login');

var router = express.Router();

router.use('/login',loginRouter);

module.exports = router;