'use strict';
var should = require('chai').should();
var request = require('supertest');
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var url = 'http://localhost:7892';

var server = request.agent(url);
var app = null;

mockgoose(mongoose);

describe('Client Controller Lib', function () {
    var clientData = {
        name: 'Client Test',
        id: '22343',
        secret: 'sesss',
        code: 'khg3423kh',
    };
    before(function (done) {
        mockgoose.reset();
        app = require('../');
        done();
    });

    describe('postClients()', function () {
        it('should create a client', function (done) {
            server
                .post('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .send(clientData)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(201);
                    var jsonResponse = res.body;
                    jsonResponse.should.have.property('message');
                    jsonResponse.should.have.property('data');
                    jsonResponse.data.should.have.property('userId');
                    jsonResponse.data.should.have.property('secret');
                    jsonResponse.data.should.have.property('id');
                    jsonResponse.data.should.have.property('name');
                    jsonResponse.data.name.should.be.equal(clientData.name);
                    jsonResponse.data.secret.should.be.equal(clientData.secret);
                    done();
                });
        });

        it('should not create a client with same name', function (done) {
            var sentData = {
                name: clientData.name,
                id: '1111',
                secret: 'sesss',
                code: '45433',
            };
            server
                .post('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .send(sentData)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(500);
                    var jsonResponse = res.body;
                    jsonResponse.should.have.property('message');
                    jsonResponse.should.have.property('statusCode');
                    jsonResponse.message.should.have.property('name');
                    jsonResponse.message.should.have.property('code');
                    jsonResponse.message.should.have.property('errmsg');
                    done();
                });
        });

        it('should not create a client without required info',
        function (done) {
            var sentData = {
                name: 'Client Test',
                id: '1111',
                code: '45433',
            };
            server
                .post('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .send(sentData)
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    var jsonResponse = res.body;
                    jsonResponse.should.have.property('message');
                    jsonResponse.should.have.property('statusCode');
                    done();
                });
        });

        it('should not create a client with empty body',
        function (done) {
            server
                .post('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(400);
                    var jsonResponse = res.body;
                    jsonResponse.should.have.property('message');
                    jsonResponse.should.have.property('statusCode');
                    done();
                });
        });
    });
    describe('getClients()', function () {
        it('should list all clients', function (done) {
            server
                .get('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    var jsonResponse = res.body;
                    jsonResponse.should.be.instanceof(Array);
                    jsonResponse[0].should.have.property('userId');
                    jsonResponse[0].should.have.property('secret');
                    jsonResponse[0].should.have.property('id');
                    jsonResponse[0].should.have.property('name');
                    jsonResponse[0].name.should.be.equal(clientData.name);
                    jsonResponse[0].secret.should.be.equal(clientData.secret);
                    done();
                });
        });

        it('should return and empty list', function (done) {
            mockgoose.reset();
            server
                .get('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .set('postman-token', 'b8c433fe-fdf9-454b-8e19-f7cef59b2ec6')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    var jsonResponse = res.body;
                    jsonResponse.should.be.instanceof(Array);
                    jsonResponse.should.have.length(0);
                    done();
                });
        });
    });
});
