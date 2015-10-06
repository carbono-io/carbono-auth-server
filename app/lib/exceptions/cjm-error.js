'use strict';

var util  = require('util');

/**
 * Receives an error from a carbono-json-message response, and transform it
 * into a carbono-auth error.
 *
 * @class CJMError
 * @module Exception
 */
var CJMError = function (resError) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.message = resError.message;
    this.statusCode = resError.code;
};

util.inherits(CJMError, Error);

module.exports = CJMError;
