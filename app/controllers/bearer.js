'use strict';
var bearerLib  = require('../lib/bearer');

module.exports = function () {

    this.validate = function (req, res) {
        bearerLib.validate(req.body).then(
            function (user) {
                res.status(200);
                res.json(bearerLib.createResponse(null, user));
                res.end();
            },
            function (err) {
                res.status(err.code);
                res.json(bearerLib.createResponse(err, null));
                res.end();
            }
        );
    };

    return this;
};
