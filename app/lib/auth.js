'use strict';

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientStrategy = require('passport-oauth2-client-password').Strategy;
var Client = require('./models/client');
var imperial = require('./bromelia-imperial-cli');
var NotFoundError = require('./exceptions/not-found');

passport.use(new BasicStrategy(
    function (username, password, callback) {
        imperial.authenticate(username, password).then(
            function (user) {
                return callback(null, user);
            },
            function (err) {
                if (err instanceof NotFoundError) {
                    return callback(null, false);
                } else {
                    return callback(null, err);
                }
            }
        ).catch(function (err) {
            return callback(null, err);
        });
    }
));

passport.use('client-basic', new BasicStrategy(
    function (clientId, clientSecret, callback) {
        Client.findOne({ id: clientId }, function (err, client) {
            if (err) {
                return callback(err);
            }

            // No client found with that id or bad password
            if (!client || client.secret !== clientSecret) {
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
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
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
