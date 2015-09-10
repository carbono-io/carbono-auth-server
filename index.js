'use strict';
var express = require('express');
var consign = require('consign');
var passport = require('passport');
var config   = require('config');
var util     = require('util');

var app = express();

// Express app configuration
app.set('view engine', 'ejs');
app.use(require('serve-static')(__dirname + '/var'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

// Configure passport strategy
app.use(passport.initialize());
app.use(passport.session());
require('./lib/passport-strategy')

// Routes and controllers
consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

// Register and Run
var etcd   = require('./lib/service-register');
var cfg = config.get('etcd');
var port = config.get('port');
var host = config.get('host');
app.listen(port, function () {
    console.log('Listening at http://%s:%s',
    host, port);
    // Service discovery registration
    etcd.init(cfg);
});