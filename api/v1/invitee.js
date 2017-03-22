let express = require('express');
let Invitee = require('../../models/invitee.js');
let User = require('../../models/user');
let bluebird = require('bluebird');

let router = express.Router();

router.get('/', function (req, res) {

    let appId = req.query.appId;

    console.log(appId);

    // Use generator functions for getting invitee list
    bluebird.coroutine(function *() {
        // Get the invitee id based on app id
        let invitees = yield Invitee.find({
            appId: mongoose.Types.ObjectId(appId)
        }).exec();

        // Map the invitee id to an array of promises each querying for invitee details
        let inviteeDetailPromise = Promise.all(Invitee.map(function (invitee, idx) {
            return User.find({_id: invitee.inviteeId}).exec();
        }));

        // Get the invitee detail from inviteeDetailPromise
        let inviteeDetail = yield inviteeDetailPromise;

        let responseArray = [];

        for (let i = 0; i < invitees.length; i++) {

            let newInvitee = {
                Invitee_Name: inviteeDetail[i].name,
                Invitee_Dp: inviteeDetail[i].dp,
                Invitee_Going: invitees[i].going,
            };
            responseArray.push(newInvitee);
        }

        return res.json(responseArray);

    })();
});
