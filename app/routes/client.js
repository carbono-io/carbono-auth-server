'use strict';
module.exports = function (app) {

    var client = app.controllers.client;
    var auth = app.controllers.auth;

    app.post('/auth/clients', auth.isAuthenticated, client.postClients);
    app.get('/auth/clients', auth.isAuthenticated, client.getClients);

    return this;
};
