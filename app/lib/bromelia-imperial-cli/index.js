'use strict';
var UserProfile = require('./user-profile');
var q           = require('q');

var env = process.env.NODE_ENV;
var isMock = false;
if (env != 'undefined' && env === 'test'){
    isMock = true;
}


this.remoteAuth = function (username, password, callback) {
    var userHelper = new UserProfile();

    userHelper.getUserInfo({
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
                function (user) {
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
};

this.mock = function (username, password, callback) {
    var user = { email : "email1@email.com" };
    return callback(null, user);
};

if(isMock){
    this.authenticate = this.mock;
} else {
    this.authenticate = this.remoteAuth;
}

exports.authenticate = this.authenticate;

exports.findUser = function (userId) {
    var deferred = q.defer();

    if (userId === '1234') {
        deferred.resolve();
    } else {
        deferred.reject();
    }

    return deferred.promise;
};
