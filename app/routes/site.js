'use strict';
module.exports = function (app) {

    var site = app.controllers.site;

	app.get('/', site.index);
	app.get('/login', site.loginForm);
	app.post('/login', site.login);
	app.get('/logout', site.logout);
	app.get('/account', site.account);

    return this;
};