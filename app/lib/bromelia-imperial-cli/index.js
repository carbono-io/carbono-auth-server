'use strict';
var UserProfile = require('./user-profile');

var env = process.env.NODE_ENV;
var isMock = false;
if (env !== 'undefined' && env === 'test') {
    isMock = true;
}

this.remoteAuth = function (username, password, callback) {
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

this.mock = function (username, password, callback) {
    var user = {
        email: 'email1@email.com',
    };
    return callback(null, user);
};

if (isMock) {
    this.authenticate = this.mock;
} else {
    this.authenticate = this.remoteAuth;
}

exports.authenticate = this.authenticate;
