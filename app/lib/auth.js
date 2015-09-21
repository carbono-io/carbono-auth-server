'use strict';

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientStrategy = require('passport-oauth2-client-password').Strategy;
var Client = require('./models/client');
var imperial = require('./bromelia-imperial-cli');

passport.use(new BasicStrategy(
    function (username, password, callback) {
        imperial.authenticate(username, password, callback);
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

passport.use(new ClientStrategy(
    function (clientId, clientSecret, done) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.secret !== clientSecret) {
                return done(null, false);
            }
            return done(null, client);
        });
    }
));

exports.isAuthenticated = passport.authenticate(['basic'],
    { session: false });

exports.isClientAuthenticated = passport.authenticate(
    ['client-basic', 'oauth2-client-password'],
    { session: false });
