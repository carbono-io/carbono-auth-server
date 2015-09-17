'use strict';

// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var Client = require('./models/client');
var Token = require('./models/token');
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

passport.use(new BearerStrategy(
    function (accessToken, callback) {
        var userHelper = new UserHelper();

        Token.findOne({value: accessToken }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            userHelper.getProfile({
                code: token.userId,
            }).then(
                function (user) {
                    // No user found
                    if (!user) { return callback(null, false); }

                    // Simple example with no scope
                    callback(null, user, { scope: '*' });
                }, function (err) {
                    if (err) { return callback(err); }
                }
            );
        });
    }
));

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'],
    { session: false });

exports.isClientAuthenticated = passport.authenticate('client-basic',
    { session: false });

exports.isBearerAuthenticated = passport.authenticate('bearer',
    { session: false });
