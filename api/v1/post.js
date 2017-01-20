let express = require('express');
let formidable = require('formidable');
let bluebird = require('bluebird');

let Post = require('../../models/post');
let Likes = require('../../models/likes');
let Comments = require('../../models/comment');

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

            let newPost = new Post();

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

    // Use generator functions for getting posts and comments and likes
    function *getPosts(appId) {

        // Get the posts array based on app id
        let posts = yield Post.find({appId: appId, timeStamp: {$lt: timeStamp}}).sort({timeStamp: 1}).exec();

        // Map the post array to an array of promises each querying for comments
        let commentsPromises = posts.map(function (post, idx) {
            return Comments.find({appId: appId, postId: post._id}).exec();
        });

        // Get the comments from commentsPromises
        let comments = yield Promise.all(commentsPromises);

        // Map the post array to likesPromises array similar to comments promises array
        let likesPromises = posts.map(function (post, idx) {
            return Likes.find({appId: appId, postId: post._id}).exec();
        });

        // Get the likes from likesPromises
        let likes = yield Promise.all(likesPromises);

        // Now merge the results from the arrays
        // TODO -- Return the merged results back as json
    }

    bluebird.coroutine(getPosts);
});

module.exports = router;
