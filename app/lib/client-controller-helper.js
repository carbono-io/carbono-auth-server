'use strict';
var Client = require('./models/client');
var q = require('q');
var MalformedRequestError = require('./exceptions/malformed-request');
var NotFoundError = require('./exceptions/not-found');
var MalformedRequestError = require('./exceptions/malformed-request');
var InternalServerError =
    require('./exceptions/internal-server-error');

/**
 * Helper for the client Controller
 *
 * @class
 */
var ClientHelper = function () {
    return this;
};

/**
 * Checks if the data has all the required properties.
 *
 * @function
 * @param {Object} data - Object which will be checked.
 * @param {string[]} required - Required properties
 * @return {string[]} All missing properties.
 */
ClientHelper.prototype.verifyParams = function (data, required) {
    var missing = [];

    if (data && required) {
        required.forEach(function (prop) {
            if (!data.hasOwnProperty(prop)) {
                missing.push(prop);
            }
        });
    }

    return missing;
};

/**
 * Function that register new clients to the auth server
 *
 * @function
 * @param {string} data.name - The name of the client
 * @param {string} data.id - The id of the client
 * @param {string} data.secret - The secret of the client
 * @param {string} data.code - The code of the client
 *
 * @returns {Object} err - Error object
 * @returns {Object} ret - Success Object
 * @returns {string} ret.message - Success string
 * @returns {Object} ret.data - The client data
 */
ClientHelper.prototype.createClient = function (data) {
    var deffered = q.defer();
    var missingProperties =
        this.verifyParams(
            data, ['name', 'id', 'secret', 'code']);
    if (missingProperties.length) {
        var errMessage = '';
        missingProperties.forEach(function (prop) {
            errMessage += 'Malformed request: ' + prop +
            ' is required.\n';
        });
        deffered.reject(
            new MalformedRequestError(errMessage));
    } else {
        try {
            var client = new Client();

            client.name = data.name;
            client.id = data.id;
            client.secret = data.secret;
            client.userId = data.code;
            client.save(function (err) {
                if (err) {
                    deffered.reject(new InternalServerError(err));
                } else {
                    deffered.resolve({
                        message: 'Client registered succesfully!',
                        data: client,
                    });
                }
            });
        } catch (e) {
            deffered.reject(new InternalServerError(e));
        }
    }
    return deffered.promise;
};

/**
 * Function that finds clients based on a identifier code
 *
 * @function
 * @param {string} data.name - The name of the client
 * @param {string} data.id - The id of the client
 * @param {string} data.secret - The secret of the client
 * @param {string} data.code - The code of the client
 *
 * @returns {Object} err - Error object
 * @returns {Object} clients - Clients data
 * @returns {string} clients.name - The name of the client
 * @returns {string} clients.id - The id of the client
 * @returns {string} clients.secret - The secret of the client
 * @returns {string} clients.userId - The userId of the client
 */
ClientHelper.prototype.getClients = function () {
    var deffered = q.defer();
    try {
        Client.find({}, function (err, clients) {
            if (err) {
                deffered.reject(new NotFoundError(err));
            } else {
                deffered.resolve(clients);
            }
        });
    } catch (e) {
        deffered.reject(new InternalServerError(e));
    }
    return deffered.promise;
};

module.exports = ClientHelper;
