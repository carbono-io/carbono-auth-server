'use strict';

var Token    = require('./models/token');
var imperial = require('./bromelia-imperial-cli');
var pjson    = require('../../package.json');
var CJM      = require('carbono-json-messages');
var uuid     = require('node-uuid');
var q        = require('q');

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

exports.createResponse = function (err, user) {
    if (err || user) {
        var cjm = new CJM({id: uuid.v4(), apiVersion: pjson.version});

        if (err) {
            cjm.setError(err);
        } else {
            cjm.setData(
                {
                    id: uuid.v4(),
                    items: [{
                        userInfo: user,
                    },],
                }
            );
        }
        return cjm.toObject();
    }

    return null;
};

exports.validate = function (message) {
    // TODO maybe:
    // var exceptions = require('carbono-exceptions');
    // exceptions.create(400, 'Malformed request');
    // ?
    var errInvalidToken = {
        code: 404,
        message: 'Invalid token',
    };
    var errMalformedRequest = {
        code: 400,
        message: 'Malformed request',
    };

    var deferred = q.defer();
    var token = extractToken(message);

    if (token) {
        Token.findOne({ value: token }, function (err, validToken) {
            if (err || !validToken) {
                deferred.reject(errInvalidToken);
            } else {
                imperial.findUser(validToken.userId).then(
                    function (user) {
                        deferred.resolve(user);
                    },
                    function () {
                        deferred.reject(errInvalidToken);
                    }
                );
            }
        });
    } else {
        deferred.reject(errMalformedRequest);
    }

    return deferred.promise;
};
