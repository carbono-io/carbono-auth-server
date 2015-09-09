/**
 * Carbono Authentication Server (based on oauth2-server npm page)
 * 
 * @author Daniel Moura
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server'),
    carbonoModel = require('./model.js'),
    should = require('should');
 
var app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(bodyParser.json());
 
app.oauth = oauthserver({
    model: carbonoModel,
    grants: ['password'],
    debug: true
});
 
app.all('/oauth/token', app.oauth.grant());
 
// app.get('/', app.oauth.authorise(), function (req, res) {
//   res.send('Secret area');
// });
 
app.use(app.oauth.errorHandler());
 
app.listen(3000);