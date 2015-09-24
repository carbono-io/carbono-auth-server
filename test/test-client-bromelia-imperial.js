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
});
