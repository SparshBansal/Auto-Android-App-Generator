var express = require('express');
var post = require('../../models/post');

var router = express.router();

router.post('/',function(req,res){

	var timeStamp = req.body.timeStamp;
	var appId = req.body.appId;

	var query = post.find({'appId' : appId}).
					where('timeStamp').gt(timeStamp).
					sort('timeStamp');
	query.select(*);
	query.exec(function(err,post[]){
		// if(err)return handleError(err);
		jsonObj = [];
		for(let i=0;i<post.length;i++){
			postItem = {};
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
	})

})
express.exports = router;