'use strict';
/**
 * Service register
 *
 * Provides the interface to the docker-container-manager handles the service
 * register service running in the carbono.io private network
 *
 * @author flaminio
 */

// External imports
var ServiceManager = require('carbono-service-manager');
require('colors');

var _inited = false;

exports.init = function (config) {
    if (typeof process.env.ETCD_SERVER === 'undefined') {
        console.log('The environment variable ETCD_SERVER is' +
        ' not defined!'.bold.red);
        console.log('Please, define it before continuing, otherwise the'.red);
        console.log('integration will not work!'.red);
        console.log();
    } else {
        global.serviceManager = new ServiceManager(process.env.ETCD_SERVER);

        /*
         * If DOCKER_HOST is defined, it means we're on Mac and we need
         * boot2docker's IP address. Otherwise, we are on a Linux distro
         * (docker host has the same address of the machine).
         */
        if (typeof process.env.DOCKER_HOST !== 'undefined') {
            config.serverAddress =
            process.env.DOCKER_HOST.split(/(tcp:\/\/)(.*)(:.*)/)[2];
        }

        var registerPromise =
        global.serviceManager.registerService(
            config.serviceAlias, config.serverAddress + ':' + config.serverPort);

        registerPromise
            .then(function () {
                _inited = true;
                console.log(
                    'INFO Registered service in etcd'.green);
            }, function (err) {
                console.log('ERROR Registering service in etcd: '.red + err);
            });
    }
};

/**
 * Register the machine in the register service.
 */
exports.register = function (machineData, callback) {
    // Waiting for definitions in 'carbono-service-manager'
    callback(null);
};

exports.unregister = function (machineData, callback) {
    // Waiting for definitions in 'carbono-service-manager'
    callback(null);
};
