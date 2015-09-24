'use strict';

var bearer   = require('../app/lib/bearer');
var Token    = require('../app/lib/models/token');
var imperial = require('../app/lib/bromelia-imperial-cli');
var chai     = require('chai');
var sinon    = require('sinon');
var q        = require('q');

var should = chai.should();

function createTokenStub() {
    var tokenStub = sinon.stub(Token, 'findOne');
    tokenStub
        .withArgs({ value: 'valid_token' })
        .yields(null, {
            userId: 'valid_user',
        });
    tokenStub
        .withArgs({ value: 'non_existent_token' })
        .yields({
            code: 404,
            message: 'Invalid token',
        }, null);
    tokenStub
        .withArgs({ value: 'token_without_user' })
        .yields(null, {
            userId: 'invalid_user',
        });

    return tokenStub;
}

function createImperialStub() {
    var imperialStub = sinon.stub(imperial, 'findUser');

    var deferredValidUser = q.defer();
    deferredValidUser.resolve({
        code: 'valid_user',
        name: 'fulano',
        email: 'email@email.com',
    });
    imperialStub
        .withArgs('valid_user')
        .returns(deferredValidUser.promise);

    var deferredInvalidUser = q.defer();
    deferredInvalidUser.reject();
    imperialStub
        .withArgs('invalid_user')
        .returns(deferredInvalidUser.promise);

    return imperialStub;
}

describe('[Token bearer]', function () {
    before(function () {
        this.tokenStub = createTokenStub();
        this.imperialStub = createImperialStub();
    });

    beforeEach(function () {
        this.requestMessage = {
            id: 'fake_id',
            apiVersion: 'fake_version',
            data:
                {
                    id: 'fake_id',
                    items:
                        [
                            {
                                token: '',
                            },
                        ],
                },
        };
    });

    after(function () {
        this.tokenStub.restore();
        this.imperialStub.restore();
    });

    describe('validate(): ', function () {
        it('validates an existing token', function (done) {
            this.requestMessage.data.items[0].token = 'valid_token';

            var promise = bearer.validate(this.requestMessage);
            promise
                .then(function (user) {
                    user.should.exist;
                    user.should.be.an('object');

                    user.should.have.property('name');
                    user.name.should.be.equal('fulano');

                    user.should.have.property('code');
                    user.code.should.be.equal('valid_user');

                    user.should.have.property('email');
                    user.email.should.be.equal('email@email.com');
                })
                .done(function () {
                    done();
                });
        });

        it('don\'t validate a non-existent token', function (done) {
            this.requestMessage.data.items[0].token = 'non_existent_token';

            var promise = bearer.validate(this.requestMessage);
            promise
                .catch(function (err) {
                    err.should.exist;
                    err.should.be.an('object');

                    err.should.have.property('code');
                    err.code.should.be.equal(404);

                    err.should.have.property('message');
                    err.message.should.be.equal('Invalid token');
                })
                .done(function () {
                    done();
                });
        });

        it('don\'t validate a malformed request', function (done) {
            var promise = bearer.validate(this.requestMessage.data);
            promise
                .catch(function (err) {
                    err.should.exist;
                    err.should.be.an('object');

                    err.should.have.property('code');
                    err.code.should.be.equal(400);

                    err.should.have.property('message');
                    err.message.should.be.equal('Malformed request');
                })
                .done(function () {
                    done();
                });
        });

        it('don\'t validate a token without an user', function (done) {
            this.requestMessage.data.items[0].token = 'token_without_user';

            var promise = bearer.validate(this.requestMessage);
            promise
                .catch(function (err) {
                    err.should.exist;
                    err.should.be.an('object');

                    err.should.have.property('code');
                    err.code.should.be.equal(404);

                    err.should.have.property('message');
                    err.message.should.be.equal('Invalid token');
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('createResponse(): ', function () {
        it('creates an error message', function () {
            var error = {
                code: 400,
                message: 'Malformed request',
            };
            var response = bearer.createResponse(error, null);

            response.should.exist;
            response.should.have.property('error');
            response.error.should.be.deep.equal(error);
        });

        it('creates a message with an user', function () {
            var user = {
                code: 'valid_user',
                name: 'fulano',
                email: 'email@email.com',
            };
            var response = bearer.createResponse(null, user);

            response.should.exist;
            response.should.have.property('data');
            response.data.should.have.property('items');
            response.data.items.should.have.length > 0;
            response.data.items[0].should.have.property('userInfo');
            response.data.items[0].userInfo.should.be.deep.equal(user);
        });

        it('doesn\'t create message if the params are null', function () {
            var response = bearer.createResponse(null, null);
            should.not.exist(response);
        });
    });
});
