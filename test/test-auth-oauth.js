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
        name: 'IDE',
        id: '1111',
        secret: 'secret',
        code: 'code1111',
    };
    before(function (done) {
        mockgoose.reset();
        app = require('../');
        done();
    });
    var clientCode = null;
    describe('postClients()', function () {
        it('should create a client IDE', function (done) {
            server
                .post('/clients')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
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
    });

    describe('oauth2/authorize', function () {
        it('should authorize access for IDE', function (done) {
            var getUrl = '/oauth2/authorize?client_id=1111&response_type=' +
            'code&redirect_uri=http://localhost:7892/clients';
            server
                .get(getUrl)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(302);
                    var text = res.text.split('code=');
                    text.should.be.instanceof(Array);
                    text.should.have.length(2);
                    clientCode = text[1];
                    done();
                });
        });

        it('should not authorize access for unknown client', function (done) {
            var getUrl = '/oauth2/authorize?client_id=666&response_type=' +
            'code&redirect_uri=http://localhost:7892/clients';
            server
                .get(getUrl)
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    done();
                });
        });
    });

    describe('oauth2/token', function () {
        it('should get a token from a valid code', function (done) {
            server
                .post('/oauth2/token')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .send({
                    code: clientCode,
                    grant_type: 'authorization_code',
                    redirect_uri: url + '/clients',
                    client_id: clientData.id,
                    client_secret: clientData.secret, })
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    var jsonResponse = res.body;
                    jsonResponse.should.have.property('access_token');
                    jsonResponse.should.have.property('token_type');
                    jsonResponse.token_type.should.be.equal('Bearer');
                    jsonResponse.access_token.should.have.property('value');
                    jsonResponse.access_token.should.have.property('clientId');
                    jsonResponse.access_token.should.have.property('userId');
                    jsonResponse.access_token.userId.should.be.equal(clientData.code)

                    done();
                });
        });

        it('should not get a token from an invalid code', function (done) {
            server
                .post('/oauth2/token')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('authorization', 'Basic ZW1haWxAMjAwLmNvbTpzZW5oYTEyMw==')
                .send({
                    code: 'invalid',
                    grant_type: 'authorization_code',
                    redirect_uri: url + '/clients',
                    client_id: clientData.id,
                    client_secret: clientData.secret, })
                .end(function (err, res) {
                    should.not.exist(err);
                    res.status.should.equal(403);
                    res.body.should.have.property('error');
                    res.body.error.should.be.equal('invalid_grant');
                    res.body.should.have.property('error_description');
                    done();
                });
        });
    });
});
