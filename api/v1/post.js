var express = require('express');
var post = require('../../models/post');
var likes = require('../../models/likes');
var commments = require('../../models/commment');

var router = express.router();

router.post('/', function (req, res) {

    var timeStamp = req.body.timeStamp;
    var appId = req.body.appId;

    var query = post.find({'appId': appId}).where('timeStamp').gt(timeStamp).sort('timeStamp');

    query.exec(function (err, post) {
        // if(err)return handleError(err);
        var jsonObj = [];
        for (var i = 0; i < post.length; i++) {
            var postItem = {};
            postItem['appId'] = post[i]['appId'];
            postItem['userId'] = post[i]['userId'];
            postItem['mimeType'] = post[i]['mimeType'];
            postItem['timeStamp'] = post[i]['timeStamp'];
            postItem['locationUri'] = post[i]['locationUri'];
            postItem['description'] = post[i]['description'];

            var likesQuery = likes.find({'appId' : post[i]['appId']}).where('postId').equals(post[i]['_id']);
            likesQuery.select('userId');
            likesQuery.exec().then(function(result){
                postItem['likes'] = result;
                return new Promise(function(resolve, reject){
                    resolve(post[i]);
                });

            }).then(function(post){
            var commmentsQuery = commments.find({'appId' : post[i]['appId']}).where('postId').equals(post[i]['_id']);
            commmentsQuery.exec().then(function(result){
                var commments = [];
                for(var i=0;i<result.length;i++){
                    var commmentItem = {};
                    commmentItem['userId'] = result[i]['userId'];
                    commmentItem['appId'] = result[i]['appId'];
                    commmentItem['postId'] = result[i]['postId'];
                    commmentItem['commment'] = result[i]['commment'];
                    commmentItem['timestamp'] = result[i]['timestamp'];
                    commments.push(commmentItem);
                }
                post['commments'] = commments;
            });
            
            });

            jsonObj.push(postItem);
        }
        return res.json(jsonObj);
    });
});
express.exports = router;