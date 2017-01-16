let express = require('express');
let loginRouter = require('./login');
let signupRouter = require('./signup');
let fetchPostRouter = require('./post');
let router = express.Router();

router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/post', fetchPostRouter);


module.exports = router;