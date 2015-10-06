'use strict';
var UserProfile = require('../app/lib/bromelia-imperial-cli/user-profile.js');
var should = require('chai').should();
var userProfile = new UserProfile('http://localhost:3000/account-manager');

function checkProfileResponse(res) {
    res.should.have.property('provider');
    res.should.have.property('id');
    res.should.have.property('displayName');
    res.should.have.property('name');
    res.name.should.be.a('object');
    res.name.should.have.property('familyName');
    res.name.should.have.property('givenName');
    res.name.should.have.property('middleName');
    res.should.have.property('emails');
    res.emails.should.be.a('array');
    res.emails[0].should.have.property('value');
    res.emails[0].should.have.property('type');
    res.should.have.property('photos');
    res.photos.should.be.a('array');
}

describe('UserProfile Lib', function () {

    describe('getProfile()', function () {
        it('Should get a profile with an existing code', function (done) {
            var promiss = userProfile.getProfile({
                code: 'user200',
            });
            promiss
                .then(
                    function (res) {
                        should;
                        checkProfileResponse(res);
                        res.id.should.be.equals('user200');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a non-existing code',
        function (done) {
            var promiss = userProfile.getProfile({
                code: 'user404',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with invalid request',
        function (done) {
            var promiss = userProfile.getProfile({
                code: 'user400',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile without code',
        function (done) {
            var promiss = userProfile.getProfile({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getUserInfo()', function () {
        it('Should get a profile with an existing email', function (done) {
            var promiss = userProfile.getUserInfo({
                email: 'email@200.com',
            });
            promiss
                .then(
                    function (res) {
                        checkProfileResponse(res);
                        res.emails[0].value.should.be.equals('email@200.com');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a non-existing email',
        function (done) {
            var promiss = userProfile.getUserInfo({
                email: 'email@404.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with invalid request',
        function (done) {
            var promiss = userProfile.getUserInfo({
                email: 'email@400.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile without email',
        function (done) {
            var promiss = userProfile.getUserInfo({
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('login()', function () {
        it('Should validate login with correct user and password',
        function (done) {
            var promiss = userProfile.login({
                email: 'email@200.com',
                password: 'sshhh',
            });
            promiss
                .then(
                    function (res) {
                        res.should.have.property('email');
                        res.should.have.property('code');
                        res.email.should.be.equals('email@200.com');
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not login with wrong email',
        function (done) {
            var promiss = userProfile.login({
                email: 'email@404.com',
                password: 'invalidEmail',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login without password',
        function (done) {
            var promiss = userProfile.login({
                email: 'email@200.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login without email',
        function (done) {
            var promiss = userProfile.login({
                password: 'missingEmail',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login with invalid email',
        function (done) {
            var promiss = userProfile.login({
                email: 'email@400.com',
                password: 'userPassword',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('statusCode');
                    err.should.have.property('message');
                    err.statusCode.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });
});
