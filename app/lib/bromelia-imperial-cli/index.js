'use strict';

/**
 * Helper methods to communicate with Account Manager server (Imperial)
 *
 * @module Bromelia Imperial Client
 */

var UserProfile = require('./user-profile');
var q           = require('q');

this.authenticate = function (username, password, callback) {
    var userHelper = new UserProfile();

    userHelper.getUserInfo({
        email: username,
    }).then(
        function (user) {
            if (user !== null) {
                // Make sure the password is correct
                userHelper.login({
                    email: username,
                    password: password,
                }).then(
                    function (user) {
                        if (user !== null) {
                            // Success
                            return callback(null, user);
                        } else {
                            return callback(null, false);
                        }
                    }, function (err) {
                        if (err.code === 404) {
                            // Invalid Password
                            return callback(null, false);
                        } else {
                            return callback('statusCode: ' + err.code +
                            ' | Error: ' + err.message);
                        }
                    }
                );
            } else {
                // No user found with that username
                return callback(null, false);
            }
        }, function (err) {
            console.log(err)
            if (err !== null) {
                return callback(err);
            }
        }
    );
};

exports.authenticate = this.authenticate;