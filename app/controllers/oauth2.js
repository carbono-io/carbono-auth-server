'use strict';
var oauth2 = require('../lib/oauth2');

module.exports = function () {

    this.authorization = oauth2.authorization;
    this.decision = oauth2.decision;
    this.token = oauth2.token;

    return this;
};
