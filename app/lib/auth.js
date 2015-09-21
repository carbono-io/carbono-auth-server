'use strict';

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var Client = require('./models/client');
var imperial = require('./bromelia-imperial-cli');

passport.use(new BasicStrategy(
    function (username, password, callback){
        imperial.auhenticate(username, password, callback);
    }
));

passport.use('client-basic', new BasicStrategy(
    function (client_id, client_secret, callback) {
        Client.findOne({ id: client_id }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== client_secret) {
                return callback(null, false);
            }

            // Success
            return callback(null, client);
        });
    }
));

exports.isAuthenticated = passport.authenticate(['basic'],
    { session: false });

exports.isClientAuthenticated = passport.authenticate('client-basic',
    { session: false });