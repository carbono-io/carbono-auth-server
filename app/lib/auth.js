'use strict';

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var Client = require('./models/client');
var UserHelper = require('./models/user-helper');

passport.use(new BasicStrategy(
    function (username, password, callback) {
        var userHelper = new UserHelper();

        userHelper.userInfo({
            email: username,
        }).then(
            function (user) {
                // No user found with that username
                if (user === null) { return callback(null, false); }

                // Make sure the password is correct
                userHelper.login({
                    email: username,
                    password: password,
                }).then(
                    function () {
                        // Success
                        return callback(null, user);
                    }, function (statusCode) {
                        // Password did not match
                        if (statusCode === 404) {
                            return callback(null, false);
                        } else {
                            return callback('statusCode: ' + statusCode);
                        }
                    }
                );
            }, function (err) {
                if (err) { return callback(err); }
            }
        );
    }
));

passport.use('client-basic', new BasicStrategy(
    function (username, password, callback) {
        Client.findOne({ id: username }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client || client.secret !== password) {
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