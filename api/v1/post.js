
let express = require('express');
let formidable = require('formidable');

let post = require('../../models/post');
let likes = require('../../models/likes');
let comments = require('../../models/comment');

let router = express.Router();

router.post("/", function (req, res) {
    // use formidable to parse the contents and the post file
    let form = formidable.IncomingForm();

    form.parse(req, function (error, fields, files) {
        if (!error) {

            console.log(fields);
            console.log(files);

            // Get the fields
            let appId = fields.appId;
            let userId = fields.userId;
            let mimeType = fields.mimeType;
            let timestamp = fields.timeStamp;
            let description = fields.description;

            // Get the path to the resource
            let locationUri = files.picture.path;

            let newPost = new post();

            newPost.appId = appId;
            newPost.userId = userId;
            newPost.mimeType = mimeType;
            newPost.timestamp = timestamp;
            newPost.description = description;
            newPost.locationUri = locationUri;

            console.log(newPost);

            newPost.save().then(function (post) {
                if (post) {
                    return res.json({"message": "Successfully posted"});
                }
            }).catch(function (error) {
                return res.json({"message": "some error occurred"});
            });
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

            let likesQuery = likes.find({'appId': post[i]['appId']}).where('postId').equals(post[i]['_id']);
            likesQuery.select('userId');
            likesQuery.exec().then(function (result) {
                postItem['likes'] = result;
                return new Promise(function (resolve, reject) {
                    resolve(post[i]);
                });

            }).then(function (post) {
                let commentsQuery = comments.find({'appId': post[i]['appId']}).where('postId').equals(post[i]['_id']);
                commentsQuery.exec().then(function (result) {
                    let comments = [];
                    for (let i = 0; i < result.length; i++) {
                        let commentItem = {};
                        commentItem['userId'] = result[i]['userId'];
                        commentItem['appId'] = result[i]['appId'];
                        commentItem['postId'] = result[i]['postId'];
                        commentItem['comment'] = result[i]['comment'];
                        commentItem['timestamp'] = result[i]['timestamp'];
                        comments.push(commentItem);
                    }
                    post['comments'] = comments;
                });

            });

            jsonObj.push(postItem);
        }
        return res.json(jsonObj);
    });
});

module.exports = router;