'use strict';
var UserProfile = require('../app/lib/bromelia-imperial-cli/user-profile.js');
var should = require('chai').should();
var userProfile = new UserProfile();

function stringGen(len) {
    var text = '';
    var charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++) {
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return text;
}

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
var userEmail = '';
var userPassword = '';
var userCode = '';
describe('UserProfile Lib', function () {
    describe('createUser()', function () {
        it('Should create a profile with all params', function (done) {
            userPassword = stringGen(12);
            var promiss = userProfile.createUser({
                name: stringGen(5) + stringGen(8),
                email: stringGen(8) + '@' + stringGen(5) + '.com',
                password: userPassword,
            });
            promiss
                .then(
                    function (res) {
                        checkProfileResponse(res);
                        userEmail = res.emails[0].value;
                        userCode = res.id;
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with missing name', function (done) {
            var promiss = userProfile.createUser({
                email: stringGen(8) + '@' + stringGen(5) + '.com',
                password: stringGen(12),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with missing email', function (done) {
            var promiss = userProfile.createUser({
                name: stringGen(5) + stringGen(8),
                password: stringGen(12),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with missing password',
        function (done) {
            var promiss = userProfile.createUser({
                name: stringGen(5) + stringGen(8),
                email: stringGen(8) + '@' + stringGen(5) + '.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with name too big',
        function (done) {
            var promiss = userProfile.createUser({
                name: stringGen(5) + stringGen(300),
                email: stringGen(8) + '@' + stringGen(5) + '.com',
                password: stringGen(12),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not create a profile with existing mail',
        function (done) {
            var promiss = userProfile.createUser({
                name: stringGen(5) + stringGen(300),
                email: userEmail,
                password: userPassword,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getProfile()', function () {
        it('Should get a profile with an existing code', function (done) {
            var promiss = userProfile.getProfile({
                code: userCode,
            });
            promiss
                .then(
                    function (res) {
                        checkProfileResponse(res);
                        res.emails[0].value.should.be.equals(userEmail);
                        res.id.should.be.equals(userCode);
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a non-existing code',
        function (done) {
            var promiss = userProfile.getProfile({
                code: 'fakeCode',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a code too big',
        function (done) {
            var promiss = userProfile.getProfile({
                code: stringGen(100),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
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
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });

    describe('getUserInfo()', function () {
        it('Should get a profile with an existing email', function (done) {
            var promiss = userProfile.getUserInfo({
                email: userEmail,
            });
            promiss
                .then(
                    function (res) {
                        checkProfileResponse(res);
                        res.emails[0].value.should.be.equals(userEmail);
                        res.id.should.be.equals(userCode);
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a non-existing email',
        function (done) {
            var promiss = userProfile.getUserInfo({
                email: 'fake@email.com',
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not get a profile with a email too big',
        function (done) {
            var promiss = userProfile.getUserInfo({
                email: stringGen(300),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
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
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
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
                email: userEmail,
                password: userPassword,
            });
            promiss
                .then(
                    function (res) {
                        res.should.have.property('email');
                        res.should.have.property('code');
                        res.email.should.be.equals(userEmail);
                        res.code.should.be.equals(userCode);
                    }
                )
                .done(function () {
                    done();
                });
        });

        it('Should not login with wrong email',
        function (done) {
            var promiss = userProfile.login({
                email: 'fake@email.com',
                password: userPassword,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login with wrong password',
        function (done) {
            var promiss = userProfile.login({
                email: userEmail,
                password: userPassword,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(404);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login without password',
        function (done) {
            var promiss = userProfile.login({
                email: userEmail,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login without email',
        function (done) {
            var promiss = userProfile.login({
                password: userPassword,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login with email too big',
        function (done) {
            var promiss = userProfile.login({
                email: stringGen(300),
                password: userPassword,
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });

        it('Should not login with password too big',
        function (done) {
            var promiss = userProfile.login({
                email: 'email@eee.com',
                password: stringGen(300),
            });
            promiss
                .catch(function (err) {
                    err.should.not.be.null;
                    err.should.have.property('code');
                    err.should.have.property('message');
                    err.code.should.be.equals(400);
                })
                .done(function () {
                    done();
                });
        });
    });
});
