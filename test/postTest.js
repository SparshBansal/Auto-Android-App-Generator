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

    let appId;
    let userId;
    before(function (done) {
        Post.remove({}, function (error) {
            done();
        });
    });

    describe("POST /api/v1/post", function () {
        it("It should post the post with multimedia to the database", function (done) {

            appId = mongoose.Types.ObjectId();
            userId = mongoose.Types.ObjectId();

            fs.readFileAsync("/home/sparsh/Pictures/Screenshot from 2017-02-26 07:59:42.png").then(function (file) {
                chai.request(server)
                    .post('/api/v1/post')
                    .set('content-type', "multipart/form-data")

                    // Attach the test file
                    .attach("postData", file, "cool_image")

                    // Have to add fields like this in case of multipart form data
                    .field("appId", appId.toString())
                    .field("userId", userId.toString())
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

        it("It should not post the post with multimedia without appId/userId to the database", function (done) {
            fs.readFileAsync("/home/sparsh/Pictures/Screenshot from 2017-02-26 07:59:42.png").then(function (file) {
                chai.request(server)
                    .post('/api/v1/post')
                    .set('content-type', "multipart/form-data")

                    // Attach the test file
                    .attach("postData", file, "cool_image.png")

                    // Have to add fields like this in case of multipart form data
                    .field("appId", mongoose.Types.ObjectId().toString())
                    .field("mimeType", "image")
                    .field("timestamp", Date.now().toString())
                    .field("description", "Here is a test post")

                    // Send the request
                    .end(function (error, res) {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property("message");
                        res.body.message.should.be.eql("userId not found");

                        done();
                    });
            });
        });

        it("It should post the post without multimedia to the database", function (done) {

            let post = {
                appId: appId,
                userId: userId,
                mimeType: "text",
                timestamp: Date.now().toString(),
                description: "Here is a text post"
            };

            chai.request(server)
                .post('/api/v1/post')
                .send(post)
                // Send the request
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Successfully posted");

                    done();
                });
        });

        it("It should not post the post without appId to the database", function (done) {

            let post = {
                userId: mongoose.Types.ObjectId(),
                mimeType: "text",
                timestamp: Date.now().toString(),
                description: "Here is a text post"
            };

            chai.request(server)
                .post('/api/v1/post')
                .send(post)
                // Send the request
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("appId not found");

                    done();
                });
        });

        it("It should post the post without userId to the database", function (done) {

            let post = {
                appId: mongoose.Types.ObjectId(),
                mimeType: "text",
                timestamp: Date.now().toString(),
                description: "Here is a text post"
            };

            chai.request(server)
                .post('/api/v1/post')
                .send(post)
                // Send the request
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("userId not found");

                    done();
                });
        });

    });

    describe("GET /api/v1/post/appId", function () {

        it("It should get all the posts from the api", function (done) {

            let url = "/api/v1/post?appId=" + appId;
            console.log(url);

            chai.request(server)
                .get(url)
                .end(function (error, res) {

                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.have.length.at.least(1);

                    done();
                })
        });

    });
});
