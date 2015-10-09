'use strict';
var q = require('q');
var request = require('request');
var CJM     = require('carbono-json-messages');
var uuid    = require('uuid');
var etcd    = require('carbono-service-manager');
var pjson   = require('../../../package.json');
var NotFoundError = require('../exceptions/not-found');
var CJMError      = require('../exceptions/cjm-error');
var MalformedRequestError = require('../exceptions/malformed-request');
var InternalServerError =
    require('../exceptions/internal-server-error');

/**
 * Class that handles requests to the Account Manager module as a middleware
 * in the communication between Auth Server and ACCM
 *
 * @class
 */
var UserProfile = function (serviceUrl) {
    this.serviceUrl = serviceUrl;
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
var mountProfileReturnMessage = function (data) {
    var profile = data.profile;
    var ret = {
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
    return ret;
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
    if (data.code !== null && data.code !== undefined) {
        var options = {
            uri: 'http://' + this.serviceUrl + '/profiles/' + data.code,
            method: 'GET',
        };
        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    try {
                        if (res.statusCode < 300) {
                            var jsonRes = JSON.parse(res.body);
                            var data = jsonRes.data.items[0];
                            deffered.resolve(mountProfileReturnMessage(data));
                        } else {
                            jsonRes = JSON.parse(res.body);
                            deffered.reject(new CJMError(jsonRes.error));
                        }
                    } catch (e) {
                        deffered.reject(new InternalServerError(e));
                    }
                } else {
                    // TODO 'err' must be handled here
                    deffered.reject(
                        new NotFoundError('Could not get profile'));
                }
            });
        } catch (e) {
            deffered.reject(new InternalServerError(e));
        }
    } else {
        deffered.reject(
            new MalformedRequestError('Missing profile code'));
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
    if (data.email) {
        var options = {
            uri: 'http://' + this.serviceUrl + '/users',
            method: 'GET',
            headers: { crbEmail: data.email },
        };

        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    try {
                        if (res.statusCode < 300) {
                            var jsonRes = JSON.parse(res.body);
                            var data = jsonRes.data.items[0];
                            deffered.resolve(mountProfileReturnMessage(data));
                        } else if (res.statusCode === 404) {
                            deffered.resolve();
                        } else {
                            jsonRes = JSON.parse(res.body);
                            deffered.reject(new CJMError(jsonRes.error));
                        }
                    } catch (e) {
                        deffered.reject(new InternalServerError(e));
                    }
                } else {
                    // TODO 'err' must be handled here
                    deffered.reject(
                        new NotFoundError('Could not get user info'));
                }
            });
        } catch (e) {
            deffered.reject(new InternalServerError(e));
        }
    } else {
        deffered.reject(new MalformedRequestError('Missing user email'));
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
        var cjm = new CJM({apiVersion: pjson.version});
        cjm.setData({
            id: uuid.v4(),
            items: [{
                email: data.email,
                password: data.password,
            },],
        });

        var options = {
            uri: 'http://' + this.serviceUrl + '/login',
            method: 'POST',
            json: cjm.toObject(),
        };

        try {
            request(options, function (err, res) {
                if (res !== null && !err) {
                    try {
                        if (res.statusCode < 300) {
                            var jsonRes = res.body;
                            deffered.resolve(jsonRes.data.items[0]);
                        } else if (res.statusCode === 404) {
                            deffered.resolve();
                        } else {
                            deffered.reject(new CJMError(res.body.error));
                        }
                    } catch (e) {
                        deffered.reject(new InternalServerError(e));
                    }
                } else {
                    // TODO 'err' must be handled here
                    deffered.reject(
                        new NotFoundError('Could not validate login'));
                }
            });
        } catch (e) {
            deffered.reject(new InternalServerError(e));
        }
    } else {
        deffered.reject(
            new MalformedRequestError('Missing user email or password'));
    }
    return deffered.promise;
};

module.exports = UserProfile;
