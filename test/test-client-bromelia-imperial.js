'use strict';

var imperial  = require('../app/lib/bromelia-imperial-cli');
var chai     = require('chai');

var should = chai.should();

describe('[Client Bromelia Imperial]', function () {
    before(function () {
        this.imperialMockPath = 'http://localhost:3000/account-manager';
    });

    describe('findUser(): ', function () {
        it('finds an user with a valid id', function (done) {
            var promise = imperial.findUser('user200', this.imperialMockPath);

            promise
                .then(function (user) {
                    user.should.exist;
                    user.should.be.an('object');

                    user.should.have.property('id');
                    user.id.should.be.equal('user200');

                    user.should.have.property('displayName');
                    user.displayName.should.be.equal('John Connor');

                    user.should.have.property('emails');
                    user.emails.should.have.lenght > 0;
                    user.emails[0].should.have.property('value');
                    user.emails[0].value.should.be
                        .equal('connor.john@resitance.com');
                })
                .done(function () {
                    done();
                });
        });

        it('can\'t find an user with an invalid id', function (done) {
            var promise = imperial.findUser('user404', this.imperialMockPath);

            promise
                .catch(function () {
                    should.pass;
                })
                .done(function () {
                    done();
                });
        });

        it('can\'t find an user without an id', function (done) {
            var promise = imperial.findUser();

            promise
                .catch(function () {
                    should.pass;
                })
                .done(function () {
                    done();
                });
        });

        it('rejects the promise if can\'t reach Imperial', function () {
            // TODO when we have total control of the mock server inside
            // this test
            should.pass;
        });
    });

    describe('authenticate(): ', function () {
        it('authenticates user with email and password', function (done) {
            var promise = imperial.authenticate('email@200.com', 'pass',
            this.imperialMockPath);

            promise
                .then(function (user) {
                    user.should.exist;
                    user.should.be.an('object');
                    user.should.have.property('email');
                    user.email.should.be.equal('email@200.com');

                    user.should.have.property('code');
                })
                .done(function () {
                    done();
                });
        });

        it('Cannot authenticate with invalid username', function (done) {
            var promise = imperial.authenticate('email@404.com', 'pass',
            this.imperialMockPath);

            promise
                .catch(function (err) {
                    err.should.have.property('statusCode');
                    err.statusCode.should.be.equal(404);
                    err.should.have.property('message');
                })
                .done(function () {
                    done();
                });
        });

        it('Cannot authenticate without password', function (done) {
            var promise = imperial.authenticate('email@200.com', '',
            this.imperialMockPath);

            promise
                .catch(function (err) {
                    err.should.have.property('statusCode');
                    err.statusCode.should.be.equal(404);
                    err.should.have.property('message');
                })
                .done(function () {
                    done();
                });
        });

        it('Cannot authenticate without email', function (done) {
            var promise = imperial.authenticate('', 'pass',
            this.imperialMockPath);

            promise
                .catch(function (err) {
                    err.should.have.property('statusCode');
                    err.statusCode.should.be.equal(404);
                    err.should.have.property('message');
                })
                .done(function () {
                    done();
                });
        });
    });
});
