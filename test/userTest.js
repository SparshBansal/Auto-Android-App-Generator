/**
 * Created by SPARSH on 1/21/2017.
 */
process.env.NODE_ENV = "test";

let mongoose = require('mongoose');
let User = require('../models/user');

let chai = require('chai');
let chai_http = require('chai-http');
let server = require('../bin/www');

let should = chai.should();

chai.use(chai_http);

describe('User', function () {
    beforeEach(function (done) {
        User.remove({}, function (error) {
            done();
        });
    });

    describe("/api/v1/signup", function () {
        it("It should add a user to the database", function (done) {
            let user = {
                "email": "sparsh_bansal@gmail.com",
                "password": "abc123",
                "username": "sparsh_bansal",
                "mobile": "9953652242"
            };

            chai.request(server)
                .post('/api/v1/signup')
                .send(user)
                .end(function (error, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property("message");
                    res.body.should.have.property("statusCode");
                    res.body.should.have.property("_id");
                    res.body.statusCode.should.be.eql(200);

                    done();
                });
        });
    });
});