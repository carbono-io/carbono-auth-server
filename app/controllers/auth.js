'use strict';
var auth = require('../lib/oauth2');

module.exports = function (app) {
	
	this.authorization = auth.authorization;
	this.decision = auth.decision;
	this.token = auth.token;
	
    return this;
};