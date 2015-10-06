'use strict';
var bearerLib  = require('../lib/bearer');
var etcd       = require('carbono-service-manager');

module.exports = function () {

    this.validate = function (req, res) {

        bearerLib.validate(req.body, etcd.getServiceUrl("accm"))
            .then(
                function (user) {
                    res.status(200);
                    res.json(bearerLib.createResponse(null, user));
                },
                function (err) {
                    res.status(err.statusCode);
                    res.json(bearerLib.createResponse(err, null));
                }
            )
            .catch(function (error) {
                res.status(500);
                res.json(bearerLib.createResponse(error, null));
            })
            .done(function () {
                res.end();
            });
    };

    return this;
};
