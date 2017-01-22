process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let Post = require('../models/post');


let chai = require('chai');
let chai_http = require('chai-http');
let server = require('../bin/www');

let should = chai.should();

chai.use(chai_http);

describe("post", function () {
    beforeEach(function (done) {
        Post.remove({}, function (error) {
            done();
        });
    });

    describe("POST /api/v1/post", function () {
        it("It should post the post with multimedia to the database", function (done) {

            chai.request(server)
                .post('/api/v1/post')
                .type('multipart/form-data')

                // Attach the test file
                .attach("postData", file, "cool_image")

                // Have to add fields like this in case of multipart form data
                .field("appId", mongoose.Types.ObjectId().toString())
                .field("userId", mongoose.Types.ObjectId().toString())
                .field("mimeType", "image")
                .field("timestamp", Date.now().toString())
                .field("description", "Here is a test post")

                // Send the request
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Successfully posted");

                    done();
                });
        });
    });
});
