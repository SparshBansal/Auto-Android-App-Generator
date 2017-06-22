let express = require('express');
let Event = require('../../models/event.js');
let bluebird = require('bluebird');

let router = express.Router();

router.get('/', function (req, res) {
    let appId = req.body.appId;
    let eventList = [];

    let events = yield Event.find({
        appId: mongoose.Types.ObjectId(appId)
    }).exec();
});

router.get('/', function (req, res) {

    let appId = req.query.appId;

    console.log(appId);

    // Use generator functions for getting invitee list
    bluebird.coroutine(function *() {
        // Get the invitee id based on app id
        let events = yield Event.find({
            appId: mongoose.Types.ObjectId(appId)
        }).exec();

        let responseArray = [];

        for (let i = 0; i < Events.length; i++) {

            let newEvent = {};
            responseArray.push(newEvent);
        }

        return res.json(responseArray);

    })();
});
