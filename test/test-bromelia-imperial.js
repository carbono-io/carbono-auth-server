'use strict';

var imperial  = require('../app/lib/bromelia-imperial-cli');
var chai     = require('chai');

var should = chai.should();

describe('[Client Bromelia Imperial]', function () {
    describe('findUser(): ', function () {
        it('finds an user with a valid id', function (done) {
            imperial.findUser('valid_user').then(
                function (user) {
                    should.exist(user);
                    user.should.be.an('object');

                    user.should.have.property('code');
                    should.equal(user.code, 'valid_user');

                    user.should.have.property('name');
                    should.equal(user.name, 'fulano');

                    user.should.have.property('email');
                    should.equal(user.email, 'email@email.com');
                },
                function (err) {
                    should.fail(null, null, err);
                }
            )
            .done(function () {
                done();
            });
        });

        it('can\'t find an user with an invalid id', function (done) {
            imperial.findUser('invalid_user').then(
                function (user) {
                    should.fail(null, null, user);
                },
                function () {
                    should.pass;
                }
            )
            .done(function () {
                done();
            });
        });

        it('can\'t find an user without an id', function () {
            imperial.findUser().then(
                function (user) {
                    should.fail(null, null, user);
                },
                function () {
                    should.pass;
                }
            )
            .done(function () {
                done();
            });
        });

        it('rejects the promise if can\'t reach Imperial', function () {
            // TODO when we have total control of the mock server inside
            // this test
            true.should.pass;
        });
    });
});
