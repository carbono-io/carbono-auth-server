'use strict';
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var request = require('supertest');
var should = require('chai').should();
var config   = require('config');
var ClientHelper = require('../app/lib/client-controller-helper.js');

mockgoose(mongoose);
var clientHelper = new ClientHelper();
describe('UserProfile Lib', function () {
    before(function (done) {
        this.timeout(5000);
        mockgoose.reset();
        mongoose.connect('mongodb://localhost:27017/carbono-auth');
        require('../app/lib/models/client.js');
        done();
    });

    after(function (done) {
        done();
    });

    describe('Create a new client /clients/ - ', function () {
        it('Can create a client IDE', function (done) {
            clientHelper.createClient({
                name: 'IDE',
                id: '1111',
                secret: 'secrettt',
                code: 'lkfjsl43lk4',
            }).then(function (res) {
                console.log(res)
            })
            .done(function () {
                done();
            });
        });
    });
});
