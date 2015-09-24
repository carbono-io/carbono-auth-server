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
    var deferredValidUser = q.defer();
    deferredValidUser.resolve({
        code: 'valid_user',
        name: 'fulano',
        email: 'email@email.com',
    });

    var deferredInvalidUser = q.defer();
    deferredInvalidUser.reject();

    var imperialStub = sinon.stub(imperial, 'findUser');
    imperialStub
        .withArgs('valid_user')
        .returns(deferredValidUser.promise);
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
                    id: 'fake_id_again',
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
            promise.then(
                function (user) {
                    should.exist(user);
                    user.should.be.an('object');

                    user.should.have.property('name');
                    should.equal(user.name, 'fulano');

                    user.should.have.property('code');
                    should.equal(user.code, 'valid_user');

                    user.should.have.property('email');
                    should.equal(user.email, 'email@email.com');

                    done();
                },
                function (err) {
                    should.fail(null, null, err);
                    done();
                }
            ).done();

            return promise;
        });

        it('don\'t validate a non-existent token', function (done) {
            this.requestMessage.data.items[0].token = 'non_existent_token';

            var promise = bearer.validate(this.requestMessage);
            promise.then(
                function (user) {
                    should.fail(null, null, user);
                    done();
                },
                function (err) {
                    should.exist(err);
                    err.should.be.an('object');

                    err.should.have.property('code');
                    should.equal(err.code, 404);

                    err.should.have.property('message');
                    should.equal(err.message, 'Invalid token');

                    done();
                }
            ).done();

            return promise;
        });

        it('don\'t validate a malformed request', function (done) {
            var promise = bearer.validate(this.requestMessage.data);
            promise.then(
                function (user) {
                    should.fail(null, null, user);
                    done();
                },
                function (err) {
                    should.exist(err);
                    err.should.be.an('object');

                    err.should.have.property('code');
                    should.equal(err.code, 400);

                    err.should.have.property('message');
                    should.equal(err.message, 'Malformed request');

                    done();
                }
            ).done();

            return promise;
        });

        it('don\'t validate a token without an user', function (done) {
            this.requestMessage.data.items[0].token = 'token_without_user';

            var promise = bearer.validate(this.requestMessage);
            promise.then(
                function (user) {
                    should.fail(null, null, user);
                    done();
                },
                function (err) {
                    should.exist(err);
                    err.should.be.an('object');

                    err.should.have.property('code');
                    should.equal(err.code, 404);

                    err.should.have.property('message');
                    should.equal(err.message, 'Invalid token');

                    done();
                }
            ).done();

            return promise;
        });
    });

    describe('createResponse(): ', function () {
        it('creates an error message', function () {
            var error = {
                code: 400,
                message: 'Malformed request',
            };
            var response = bearer.createResponse(error, null);

            should.exist(response);
            response.should.have.property('error');
            response.error.should.have.property('code');
            should.equal(response.error.code, 400);
            response.error.should.have.property('message');
            should.equal(response.error.message, 'Malformed request');
        });

        it('creates a message with an user', function () {
            var user = {
                code: 'valid_user',
                name: 'fulano',
                email: 'email@email.com',
            };
            var response = bearer.createResponse(null, user);

            should.exist(response);
            response.should.have.property('data');
            response.data.should.have.property('items');
            response.data.items.should.have.length > 0;
            response.data.items[0].should.have.property('userInfo');
            response.data.items[0].userInfo.should.have.property('code');
            should.equal(response.data.items[0].userInfo.code, 'valid_user');
            response.data.items[0].userInfo.should.have.property('name');
            should.equal(response.data.items[0].userInfo.name, 'fulano');
            response.data.items[0].userInfo.should.have.property('email');
            should.equal(
                response.data.items[0].userInfo.email, 'email@email.com');
        });

        it('doesn\'t create message if the params are null', function () {
            var response = bearer.createResponse(null, null);
            should.not.exist(response);
        });
    });
});
