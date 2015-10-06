'use strict';

var util  = require('util');

/**
 * Defines a Malformed Request Exception inside carbono-auth.
 *
 * @class MalformedRequestError
 * @module Exception
 */
var MalformedRequestError = function (message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = 'Malformed Request';
    this.statusCode = 400;

    if (message) {
        this.message = this.message + ' - ' + message;
    }
};

util.inherits(MalformedRequestError, Error);

module.exports = MalformedRequestError;
