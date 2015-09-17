'use strict';
var Client = require('../lib/models/client');

module.exports = function () {

    this.postClients = function (req, res) {
        var client = new Client();

        client.name = req.body.name;
        client.id = req.body.id;
        client.secret = req.body.secret;
        client.userId = req.user.code;

        client.save(function (err) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Client added to the locker!', data: client });
        });
    };

    this.getClients = function (req, res) {
        Client.find({ userId: req.user.code }, function (err, clients) {
            if (err) {
                res.send(err);
            }

            res.json(clients);
        });
    };

    return this;
};
