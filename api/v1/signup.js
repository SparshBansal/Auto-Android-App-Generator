let express = require('express');
let User = require('../../models/user');

let router = express.Router();

router.post('/', function (req, res) {

    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let mobile = req.body.mobile;

    User.findOne({'local.email': email}).exec().then(function (user) {
        if (user) {
            res.json({message: 'SignUp Unsuccusfull , User Already exists', statusCode: 400});
            return null;
        }
        else {
            let newUser = new User();

            newUser.local.email = email;
            newUser.local.username = username;
            newUser.local.password = password;
            newUser.local.mobile = mobile;

            return newUser.save();
        }
    }).then(function (user) {
        if (user) {
            return res.json({
                'message': 'Signup Successfull',
                statusCode: 200,
                _id: user._id
            });
        }
        return;
    }).catch(function (error) {
        console.log(error);
        return res.json({
            'message': "Signup Failed , Server Error",
            statusCode: 500
        });
    });
});

module.exports = router;