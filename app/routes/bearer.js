'use strict';
module.exports = function (app) {

    var bearer = app.controllers.bearer;

    app.post('/auth/bearer/validate', bearer.validate);

    return this;
};
