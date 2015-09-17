'use strict';
module.exports = function (app) {

    var client = app.controllers.client;
    var auth = app.controllers.auth;

    app.post('/clients', auth.isAuthenticated, client.postClients);
    app.get('/clients', auth.isAuthenticated, client.getClients);

    return this;
};
