'use strict';
module.exports = function (app) {

    var auth = app.controllers.auth;

	app.get('/dialog/authorize', auth.authorization);
	app.post('/dialog/authorize/decision', auth.decision);
	app.post('/oauth/token', auth.token);

    return this;
};