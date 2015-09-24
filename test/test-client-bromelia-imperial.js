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

            promise.then(
                function (user) {
                    should.exist(user);
                    user.should.be.an('object');

                    user.should.have.property('id');
                    should.equal(user.id, 'user200');

                    user.should.have.property('displayName');
                    should.equal(user.displayName, 'John Connor');

                    user.should.have.property('emails');
                    user.emails.should.have.lenght > 0;
                    user.emails[0].should.have.property('value');
                    should.equal(
                        user.emails[0].value, 'connor.john@resitance.com');

                    done();
                },
                function (err) {
                    should.fail(null, null, err);
                    done();
                }
            ).done();

            return promise;
        });

        it('can\'t find an user with an invalid id', function (done) {
            var promise = imperial.findUser('user404', this.imperialMockPath);

            promise.then(
                function (user) {
                    should.fail(null, null, user);
                    done();
                },
                function () {
                    should.pass;
                    done();
                }
            ).done();

            return promise;
        });

        it('can\'t find an user without an id', function (done) {
            var promise = imperial.findUser();

            promise.then(
                function (user) {
                    should.fail(null, null, user);
                    done();
                },
                function () {
                    should.pass;
                    done();
                }
            ).done();

            return promise;
        });

        it('rejects the promise if can\'t reach Imperial', function () {
            // TODO when we have total control of the mock server inside
            // this test
            true.should.pass;
        });
    });
});
