'use strict';
var express  = require('express');
var consign  = require('consign');
var passport = require('passport');
var mongoose = require('mongoose');
var config   = require('config');

// Connect to the auth MongoDB as microservices arch state
mongoose.connect('mongodb://localhost:27017/carbono-auth');

var app = express();

// Express app configuration
app.set('view engine', 'ejs');

app.use(require('body-parser').urlencoded({
    extended: true,
}));

app.use(require('express-session')({
    secret: 'Yog-Sottoth umara ish abec',
    saveUninitialized: true,
    resave: true,
}));

// Configure passport strategy
app.use(passport.initialize());

// Routes and controllers
consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

// Register and Run
var etcd = require('./lib/service-register');
var cfg  = config.get('etcd');
var port = config.get('port');
var host = config.get('host');
app.listen(port, function () {
    console.log('Listening at http://%s:%s',
    host, port);
    // Service discovery registration
    etcd.init(cfg);
});
