'use strict';
module.exports = function (app) {

    var oauth2 = app.controllers.oauth2;
    var auth = app.controllers.auth;

    // Create endpoint handlers for oauth2 authorize
    app.get('/auth/oauth2/authorize', auth.isAuthenticated, oauth2.authorization);
    app.post('/auth/oauth2/authorize', auth.isAuthenticated, oauth2.decision);

    // Create endpoint handlers for oauth2 token
    app.post('/auth/oauth2/token', auth.isClientAuthenticated, oauth2.token);

    return this;
};
