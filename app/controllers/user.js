'use strict';
var UserHelper = require('../lib/models/user-helper');
var uuid = require('node-uuid');

module.exports = function () {

    this.postUsers = function (req, res) {
        var userHelper = new UserHelper();

        userHelper.createUser({
            code: uuid.v4(),
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).then(
            function () {
                res.json({ message: 'User created.' });
            }, function (err) {
                res.send(err);
            }
        );
    };

    this.getUsers = function (req, res) {
        res.json({message: 'account-manager don\'t implement getUsers'});
    };

    // this.getUsers = function (req, res) {
    //   User.find(function(err, users) {
    //     if (err)
    //       res.send(err);
    //
    //     res.json(users);
    //   });
    // };

    return this;
};
