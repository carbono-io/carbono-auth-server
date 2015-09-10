'use strict';
var user = require('../lib/user');
var client = require('../lib/client');

module.exports = function (app) {
	
	this.info = user.info;
	this.clientInfo = client.info;
	
    return this;
};