'use strict';

/**
 * This module contains all methods to deal with Bearer Token Authentication.
 *
 * @module Token Bearer
 */

var MalformedRequestError = require('./exceptions/malformed-request');
var NotFoundError         = require('./exceptions/not-found');
var Token                 = require('./models/token');
var imperial              = require('./bromelia-imperial-cli');
var pjson                 = require('../../package.json');

var CJM    = require('carbono-json-messages');
var uuid   = require('node-uuid');
var q      = require('q');

/**
 * Extract token information from a carbono-json-message.
 *
 * @param {Object} message - carbono-json-message containing the token.
 * @return {string} token
 * @function
 */
var extractToken = function (message) {
    var validStructure = message &&
        message.hasOwnProperty('data') &&
        message.data.hasOwnProperty('items') &&
        message.data.items.length > 0 &&
        message.data.items[0].hasOwnProperty('token');

    if (validStructure) {
        return message.data.items[0].token;
    }

    return null;
};

/**
 * Create a carbono-json-message object to be used inside Response, containing
 user informations.
 *
 * @param {Object} err - Error description, as defined in carbono-json-messages
 * @param {Object} user - User informations
 * @return {Object} carbono-json-message ready to be included inside a response.
 * @function
 */
exports.createResponse = function (err, user) {
    if (err || user) {
        var cjm = new CJM({id: uuid.v4(), apiVersion: pjson.version});

        if (err) {
            cjm.setError({
                code: err.statusCode,
                message: err.message,
            });
        } else {
            cjm.setData({
                id: uuid.v4(),
                items: [{
                    userInfo: user,
                },],
            });
        }
        return cjm.toObject();
    }

    return null;
};

/**
 * Verify if a token is valid and retrieve the associated user.
 *
 * @param {string} message - carbono-json-message from Request containing a
 token
 * @param {string} imperialPath - path to access Imperial
 * @return {Object} promise which will be resolved when an user was found, and
 rejected when an error occurs or when the token is invalid.
 * @function
 */
exports.validate = function (message, imperialPath) {
    var deferred = q.defer();
    var token = extractToken(message);

    if (token) {
        Token.findOne({ value: token }, function (err, validToken) {
            if (err || !validToken) {
                deferred.reject(new NotFoundError('Invalid token'));
            } else {
                imperial.findUser(validToken.userId, imperialPath)
                    .done(
                        function (user) {
                            deferred.resolve(user);
                        },
                        function (err) {
                            deferred.reject(err);
                        }
                    );
            }
        });
    } else {
        deferred.reject(new MalformedRequestError());
    }

    return deferred.promise;
};
