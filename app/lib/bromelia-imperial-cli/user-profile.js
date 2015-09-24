'use strict';
var q = require('q');
var request = require('request');

/**
 * Class that handles requests to the Account Manager module as a middleware
 * in the communication between Auth Server and ACCM
 *
 * @class
 */
var UserProfile = function () {
    this.path = 'http://localhost:7888/account-manager';
    return this;
};

/**
 * Mouts a default profile data structure to be sent as response
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.email - The email of the user
 * @param {string} data.password - The password of the user
 * @param {string} data.name - The name of the user
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
var mountProfileReturnMessage = function (profile) {
    var data = {
        provider: 'carbono-oauth2',
        id: profile.code,
        displayName: profile.name,
        name: {
            familyName: profile.name,
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
 * @param {string} data.name - The name of the user
 *
 * @returns {string} data.code - The error code in case of error
 * @returns {string} data.message - The error message in case of error
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
UserProfile.prototype.createUser = function (data) {
    var deffered = q.defer();
    if (data.name && data.email && data.password) {
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
        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = res.body;
                            var data = jsonRes.data.items[0];
                            deffered.resolve(mountProfileReturnMessage(data));
                        } catch (e) {
                            deffered.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        deffered.reject({
                            code: res.body.error.code,
                            message: res.body.error.message,
                        });
                    }
                } else {
                    deffered.reject({
                        code: 500,
                        message: 'Could not create profile',
                    });
                }
            });
        } catch (e) {
            deffered.reject({
                code: 400,
                message: e,
            });
        }
    } else {
        deffered.reject({
            code: 400,
            message: 'Malformed Request - Missing name, email or password',
        });
    }
    return deffered.promise;
};

/**
 * Calls AccountManager to get the user profile
 *
 * @function
 * @param {Object} data - Object containing necessary data
 * @param {string} data.code - The code of the profile
 *
 * @returns {string} data.code - The error code in case of error
 * @returns {string} data.message - The error message in case of error
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
UserProfile.prototype.getProfile = function (data) {
    var deffered = q.defer();
    if (data.code !== null) {
        var options = {
            uri: this.path + '/profiles/' + data.code,
            method: 'GET',
        };
        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = res.body;
                            var data = jsonRes.data.items[0];
                            deffered.resolve(mountProfileReturnMessage(data));
                        } catch (e) {
                            deffered.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        deffered.reject({
                            code: res.body.error.code,
                            message: res.body.error.message,
                        });
                    }
                } else {
                    deffered.reject({
                        code: 500,
                        message: 'Could not get profile',
                    });
                }
            });
        } catch (e) {
            deffered.reject({
                code: 500,
                message: e,
            });
        }
    } else {
        deffered.reject({
            code: 400,
            message: 'Malformed Request - Missing profile code',
        });
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
 * @returns {string} data.code - The error code in case of error
 * @returns {string} data.message - The error message in case of error
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
UserProfile.prototype.getUserInfo = function (data) {
    var deffered = q.defer();
    if (data.email !== null) {
        var options = {
            uri: this.path + '/users',
            method: 'GET',
            headers: { crbEmail: data.email },
        };

        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = JSON.parse(res.body);
                            var data = jsonRes.data.items[0];
                            deffered.resolve(mountProfileReturnMessage(data));
                        } catch (e) {
                            deffered.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        deffered.reject({
                            code: res.body.error.code,
                            message: res.body.error.message,
                        });
                    }
                } else {
                    deffered.reject({
                        code: 500,
                        message: 'Could not get user info',
                    });
                }
            });
        } catch (e) {
            deffered.reject({
                code: 500,
                message: e,
            });
        }
    } else {
        deffered.reject({
            code: 400,
            message: 'Malformed Request - Missing user email',
        });
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
UserProfile.prototype.login = function (data) {
    var deffered = q.defer();
    if (data.email && data.password) {
        var options = {
            uri: this.path + '/login',
            method: 'POST',
            json: {
                apiVersion: '1.0',
                id: '23123',
                data:
                    {
                        id: '12344',
                        items: [{
                            email: data.email,
                            password: data.password,
                        },],

                    },
            },
        };
        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    if (res.statusCode < 300) {
                        try {
                            var jsonRes = res.body;
                            deffered.resolve(jsonRes.data.items[0]);
                        } catch (e) {
                            deffered.reject({
                                code: 500,
                                message: e,
                            });
                        }
                    } else {
                        deffered.reject({
                            code: res.body.error.code,
                            message: res.body.error.message,
                        });
                    }
                } else {
                    deffered.reject({
                        code: 500,
                        message: 'Could connect to module',
                    });
                }
                if (!err &&  res && res.statusCode === 200) {
                    deffered.resolve(res.body.data.items[0]);
                } else {
                    deffered.reject(res.statusCode);
                }
            });
        } catch (e) {
            deffered.reject({
                code: 500,
                message: e,
            });
        }
    } else {
        deffered.reject({
            code: 400,
            message: 'Malformed Request - Missing user email or password',
        });
    }
    return deffered.promise;
};

module.exports = UserProfile;
