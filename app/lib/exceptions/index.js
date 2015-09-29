'use strict';

/**
 * Exposes all types of errors
 *
 * @module Exception
 */

var CJMError = require('./cjm-error');
var InternalServerError = require('./internal-server-error');
var MalformedRequestError = require('./malformed-request');
var NotFoundError = require('./not-found');

exports.CJMError = CJMError;
exports.InternalServerError = InternalServerError;
exports.MalformedRequestError = MalformedRequestError;
exports.NotFoundError = NotFoundError;
