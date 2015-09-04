/**
 * Stub model for Carbono Authentication Server
 * 
 * @author Daniel Moura
 */

var model = module.exports;

model.getClient = function (id, secret, callback) {
    callback(false, { clientId: 'moura', clientSecret: 'carbono123' });
};

model.grantTypeAllowed = function (clientId, grantType, callback) {
    callback(false, true);
};

model.getUser = function (uname, pword, callback) {
    callback(false, { id: 1 });
};

model.generateToken = function (type, req, callback) {
    req.oauth.client.clientId.should.equal('moura');
    req.oauth.client.clientSecret.should.equal('carbono123');
    req.user.id.should.equal(1);
    callback(false, 'abcd1234');
};

model.saveAccessToken = function (token, clientId, expires, user, cb) {
    token.should.equal('abcd1234');
    cb();
};

model.getAccessToken = function (token, callback) {
    token.should.equal('abcd1234');
    var expires = new Date();
    expires.setSeconds(expires.getSeconds() + 20);
    callback(false, { expires: expires });
}
