'use strict';

var util  = require('util');

/**
 * Defines a Not Found Exception inside carbono-auth. Represents HTTP Status
 * Code for 'Not Found' (404).
 *
 * @class NotFoundError
 * @module Exception
 */
var NotFoundError = function (message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.statusCode = 404;
};

util.inherits(NotFoundError, Error);

module.exports = NotFoundError;
