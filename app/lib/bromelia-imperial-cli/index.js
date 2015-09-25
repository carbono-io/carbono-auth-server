'use strict';

/**
 * Helper methods to communicate with Account Manager server (Imperial)
 *
 * @module Bromelia Imperial Client
 */

var UserProfile = require('./user-profile');
var q           = require('q');

var env = process.env.NODE_ENV;
var isMock = false;
if (env !== 'undefined' && env === 'test') {
    isMock = true;
}

function remoteAuth(username, password, callback) {
    var userHelper = new UserProfile('http://localhost:7888/account-manager');

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
}
function mock(username, password, callback) {
    var user = { email: 'email1@email.com' };
    return callback(null, user);
}

if (isMock) {
    exports.authenticate = mock;
} else {
    exports.authenticate = remoteAuth;
}

/**
 * Find an user at account-manager (Imperial).
 *
 * @param {string} userId - user identifier
 * @param {string} imperialPath - path to access Imperial
 * @return {Object} promise which will be resolved when an user was found, and
 will be rejected when an error occurs or when the id is invalid.
 * @function
 */
exports.findUser = function (userId, imperialPath) {
    var deferred = q.defer();
    var userHelper = new UserProfile(imperialPath);

    userHelper.getProfile({code: userId})
    .then(
        function (user) {
            if (user) {
                deferred.resolve(user);
            } else {
                deferred.reject();
            }
        },
        function () {
            deferred.reject();
        }
    );

    return deferred.promise;
};
