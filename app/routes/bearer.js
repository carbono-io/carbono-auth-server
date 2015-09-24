'use strict';
module.exports = function (app) {

    var bearer = app.controllers.bearer;

    app.post('/bearer/validate', bearer.validate);

    return this;
};
