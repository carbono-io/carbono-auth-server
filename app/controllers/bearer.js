'use strict';
var bearerLib  = require('../lib/bearer');
var etcd       = require('../../lib/etcd-manager');
var config     = require('config');

module.exports = function () {

    this.validate = function (req, res) {
        var imperialPath = config.etcd.hosts.key;

        bearerLib.validate(req.body, etcd.getServiceUrl(imperialPath))
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
            .done(function () {
                res.end();
            });
    };

    return this;
};
