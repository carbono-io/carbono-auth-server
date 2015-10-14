'use strict';
var express  = require('express');
var consign  = require('consign');
var passport = require('passport');
var mongoose = require('mongoose');
var config   = require('config');
var parser   = require('body-parser');
var mongourl = config.get('mongourl');
// Connect to the auth MongoDB as microservices arch state
mongoose.connect(mongourl);

var app = express();

// Express app configuration
app.set('view engine', 'ejs');

app.use(parser.urlencoded({
    extended: true,
}));
app.use(parser.json());

app.use(require('express-session')({
    secret: 'Yog-Sottoth umara ish abec',
    saveUninitialized: true,
    resave: true,
}));

// allow cross-domain. see http://www.w3.org/TR/cors/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

// Configure passport strategy
app.use(passport.initialize());

// Routes and controllers
consign({cwd: 'app'})
    .include('controllers')
    .include('routes')
    .into(app);

// Register and Run();
var port = config.get('port');
var host = config.get('host');
app.listen(port, function () {
    console.log('Listening at http://%s:%s',
    host, port);
    require('carbono-service-manager');
});
