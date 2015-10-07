'use strict';
var ClientHelper = require('../lib/client-controller-helper');
module.exports = function () {

    /**
     * Function that register new clients to the auth server
     * TODO Message Pattern
     * @function
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Object} res.body - Object containing the necessary data
     * @param {string} res.body.name - The name of the client
     * @param {string} res.body.id - The id of the client
     * @param {string} res.body.secret - The secret of the client
     * @param {string} res.body.code - The code of the client
     *
     * @returns {Object} err - Error object
     * @returns {Object} ret - Success Object
     * @returns {string} ret.message - Success string
     * @returns {Object} ret.data - The client data
     */
    this.postClients = function (req, res) {
        var clientHelper = new ClientHelper();
        clientHelper.createClient(req.body)
        .then(
            function (data) {
                res.status(201);
                res.json(data);
            }
        ).catch(function (error) {
            res.status(error.statusCode);
            res.json(error);
        })
        .done(function () {
            res.end();
        });
    };

    /**
     * Function that gets a client registered on the auth server
     * TODO Message Pattern
     * @function
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Object} res.body - Object containing the necessary data
     * @param {string} res.body.code - The code of the client
     *
     * @returns {Object} err - Error object
     * @returns {Object} clients - Object containing client data
     */
    this.getClients = function (req, res) {
        var clientHelper = new ClientHelper();
        clientHelper.getClients()
        .then(
            function (data) {
                res.status(200);
                res.json(data);
            }
        ).catch(function (error) {
            res.status(error.statusCode);
            res.json(error);
        })
        .done(function () {
            res.end();
        });
    };

    return this;
};
