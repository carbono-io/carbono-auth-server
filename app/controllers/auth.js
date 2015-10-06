'use strict';
var auth = require('../lib/auth');

module.exports = function () {

    this.isAuthenticated = auth.isAuthenticated;
    this.isClientAuthenticated = auth.isClientAuthenticated;

    return this;
};
