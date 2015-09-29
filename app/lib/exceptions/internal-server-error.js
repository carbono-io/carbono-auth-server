'use strict';

var util  = require('util');

/**
 * Defines a Internal Server Error inside carbono-auth.
 *
 * @class InternalServerError
 * @module Exception
 */
var InternalServerError = function (message) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    this.statusCode = 500;
};

util.inherits(InternalServerError, Error);

module.exports = InternalServerError;
