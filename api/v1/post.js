let express = require('express');
let formidable = require('formidable');

let post = require('../../models/post');

let router = express.Router();

router.post("/", function (req, res) {
    // use formidable to parse the contents and the post file
    let form = formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (!error) {
            console.log(fields);
            console.log(files);
            return res.json({message : "Files and fields recieved"});
        }
    });
});

router.get('/', function (req, res) {

    let timeStamp = req.body.timeStamp;
    let appId = req.body.appId;

    let query = post.find({'appId': appId}).where('timeStamp').gt(timeStamp).sort('timeStamp');

    query.exec(function (err, post) {
        // if(err)return handleError(err);
        jsonObj = [];
        for (let i = 0; i < post.length; i++) {
            let postItem = {};
            postItem['appId'] = post[i]['appId'];
            postItem['userId'] = post[i]['userId'];
            postItem['mimeType'] = post[i]['mimeType'];
            postItem['timeStamp'] = post[i]['timeStamp'];
            postItem['locationUri'] = post[i]['locationUri'];
            postItem['description'] = post[i]['description'];
            postItem['likes'] = post[i]['likes'];
            jsonObj.push(postItem);
        }
        return res.json(jsonObj);
    });
});

module.exports = router;