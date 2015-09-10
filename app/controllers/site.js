'use strict';
var site = require('../lib/site');

module.exports = function (app) {
	
	this.index = site.index;
	this.loginForm = site.loginForm;
	this.login = site.login;
	this.logout = site.logout;
	this.account = site.account;
	
    return this;
};