'use strict';
module.exports = function (app) {

    var user = app.controllers.user;
	
	app.get('/api/userinfo', user.info);
	app.get('/api/clientinfo', user.clientInfo);

    return this;
};