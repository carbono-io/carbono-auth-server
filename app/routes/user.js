'use strict';
module.exports = function (app) {

    var user = app.controllers.user;
	var auth = app.controllers.auth;
	
	app.post('/users', user.postUsers);
	app.get('/users', auth.isAuthenticated, user.getUsers);
	
    return this;
};