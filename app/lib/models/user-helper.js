'use strict';

var q = require('q');
var request = require('request');

var ProfileUser = function () {
    this.path = 'http://localhost:7888/account-manager';
    return this;
};

/**
PARA CRIPTOGRAFIA:

-// Load required packages
-var mongoose = require('mongoose');
-var bcrypt = require('bcrypt-nodejs');
-
-// Define our user schema
-var UserSchema = new mongoose.Schema({
-  username: {
-    type: String,
-    unique: true,
-    required: true
-  },
-  password: {
-    type: String,
-    required: true
-  }
-});
-
-// Execute before each user.save() call
-UserSchema.pre('save', function(callback) {
-  var user = this;
-
-  // Break out if the password hasn't changed
-  if (!user.isModified('password')) return callback();
-
-  // Password changed so we need to hash it
-  bcrypt.genSalt(5, function(err, salt) {
-    if (err) return callback(err);
-
-    bcrypt.hash(user.password, salt, null, function(err, hash) {
-      if (err) return callback(err);
-      user.password = hash;
-      callback();
-    });
-  });
-});
-
-UserSchema.methods.verifyPassword = function(password, cb) {
-  bcrypt.compare(password, this.password, function(err, isMatch) {
-    if (err) return cb(err);
-    cb(null, isMatch);
-  });
-};
-
-// Export the Mongoose model
-module.exports = mongoose.model('User', UserSchema);
*/

var mountProfileReturnMessage = function (profile) {
    var data = {
        provider: 'carbono-oauth2',
        code: profile.code,
        displayName: profile.name,
        name: {
            familyName:
                profile.name.split(' ')[profile.name.split(' ').length - 1],
            givenName: profile.name,
            middleName: '',
        },
        emails: [{
            value: profile.email,
            type: 'personal',
        },],
        photos: [],
    };
    return data;
};

/**
 * Calls AccountManager to create a user with the given data
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.email - The email of the user
 * @param {string} data.password - The password of the user
 * @param {string} data.code - The code of the user
 * @param {string} data.name - The name of the user
 *
 * @returns {boolean} true - Operation success
 * @returns {boolean} false - Operation error
 */
ProfileUser.prototype.createUser = function (data) {
    var deffered = q.defer();
    if (data.code && data.name && data.email && data.password) {

        var options = {
            uri: this.path + '/profiles',
            method: 'POST',
            json: {
                apiVersion: '1.0',
                id: '23123-123123123-12312',
                data:
                    {
                        id: '1234',
                        items: [{
                            code: data.code,
                            name: data.name,
                            email: data.email,
                            password: data.password,
                        },],
                    },
            },
        };

        request(options, function (err, res) {
                if (!err && res.statusCode === 200) {
                    deffered.resolve(true);
                } else {
                    deffered.reject(false);
                }
            });
    } else {
        deffered.reject(false);
    }
    return deffered.promise;
};

/**
 * Calls AccountManager to get the user profile
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.code - The code of the user
 *
 * @returns {Object} data - Object containing the ProfileInfo
 * @returns {string} data.provider - The provider with which the user
 * authenticated
 * @returns {string} data.displayName - The name of this user, suitable for
 * display.
 * @returns {Object} data.name - The complete name of the user
 * @returns {string} data.name.familyName - The family name of this user, or
 * "last name" in most Western languages.
 * @returns {string} data.name.givenName - The given name of this user, or
 * "first name" in most Western languages.
 * @returns {string} data.name.middleName - The middle name of this user.
 * @returns {Array} data.email - The list of emails
 * @returns {string} data.email[0].value - The actual email address.
 * @returns {string} data.email[0].type - The type of email address
 * (home, work, etc.).
 */
ProfileUser.prototype.getProfile = function (data) {
    var deffered = q.defer();
    if (data.code) {
        var options = {
            uri: this.path + '/profiles/' + data.code,
            method: 'GET',
        };

        request(options, function (err, res) {
                if (!err && res.statusCode === 200) {
                    try {
                        var jObj = JSON.parse(res.body);
                        jObj = JSON.parse(jObj);
                        var data = jObj.data.items[0].profile;
                        deffered.resolve(mountProfileReturnMessage(data));
                    } catch (e) {
                        deffered.reject(false);
                    }

                } else if (res.statusCode === 404) {
                    deffered.resolve(null);
                } else {
                    deffered.reject(false);
                }
            });
    } else {
        deffered.reject(false);
    }
    return deffered.promise;
};

/**
 * Calls AccountManager to check a user email and password
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.email - The email of the user
 * @param {string} data.password - The password of the user
 *
 * @returns {boolean} true - Operation success
 * @returns {boolean} false - Operation error
 */
ProfileUser.prototype.login = function (data) {
    var deffered = q.defer();
    if (data.email && data.password) {
        var options = {
            uri: this.path + '/login',
            method: 'POST',
            json: {
                apiVersion: '1.0',
                id: '23123-123123123-12312',
                data:
                    {
                        id: '1234',
                        items: [{
                            email: data.email,
                            password: data.password,
                        },],

                    },
            },
        };

        request(options, function (err, res) {
                if (!err && res.statusCode === 200) {
                    deffered.resolve();
                } else {
                    deffered.reject(res.statusCode);
                }
            });
    } else {
        deffered.reject();
    }
    return deffered.promise;
};

/**
 * Calls AccountManager to get the user profile
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.email - The email of the user
 *
 * @returns {Object} data - Object containing the ProfileInfo
 * @returns {string} data.provider - The provider with which the user
 * authenticated
 * @returns {string} data.displayName - The name of this user, suitable for
 * display.
 * @returns {Object} data.name - The complete name of the user
 * @returns {string} data.name.familyName - The family name of this user, or
 * "last name" in most Western languages.
 * @returns {string} data.name.givenName - The given name of this user, or
 * "first name" in most Western languages.
 * @returns {string} data.name.middleName - The middle name of this user.
 * @returns {Array} data.email - The list of emails
 * @returns {string} data.email[0].value - The actual email address.
 * @returns {string} data.email[0].type - The type of email address
 * (home, work, etc.).
 */
ProfileUser.prototype.userInfo = function (data) {
    var deffered = q.defer();
    if (data.email) {
        var options = {
            uri: this.path + '/userInfo',
            method: 'POST',
            json: {
                apiVersion: '1.0',
                id: '23123-123123123-12312',
                data:
                    {
                        id: '1234',
                        items: [{
                            email: data.email,
                        },],
                    },
            },
        };

        request(options, function (err, res) {
                if (!err && res.statusCode === 200) {
                    try {
                        var jObj = JSON.parse(res.body);
                        var data = jObj.data.items[0].profile;
                        deffered.resolve(mountProfileReturnMessage(data));
                    } catch (e) {
                        deffered.reject();
                    }
                } else {
                    if (res.statusCode === 404) {
                        deffered.resolve(null);
                    } else {
                        deffered.reject();
                    }
                }
            });
    } else {
        deffered.reject();
    }
    return deffered.promise;
};

module.exports = ProfileUser;
