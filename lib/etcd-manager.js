'use strict';
var ServiceManager  = require('carbono-service-manager');
require('colors');

var singleton = function singleton(){
    this._serviceManager  = null;
    this._registered      = false;
    var _services        = {};
    
    /**
    * Initialize the communication with etcd. An environment variable named
    * ETCD_SERVER must exist, with a URL location to access the service.
    * After comm is set then it registers the module on etcd. 
    *
    * @function
    */
    this.init = function (key, alias, host, port) {
        if (!key || !alias || !host || !port) {
            console.log('ETCD not configured! Please check config.'
                .bold.red);
            return;
        }
        if (typeof process.env.ETCD_SERVER === 'undefined') {
            console.log('The environment variable ETCD_SERVER is not defined!'
                .bold.red);
            console.log('Please, define it before continuing, otherwise the'
                .red);
            console.log('integration will not work!'.red);
            console.log();
        } else {
            this._serviceManager = new ServiceManager(process.env.ETCD_SERVER);
            var promise = this._serviceManager.registerService(key, host + ':' + port);
            promise.then(
                function () {
                    console.log(alias.green + ' registered with etcd.'.green);
                    this._registered = true;
                }, function (err) {
                    console.log('[ERROR] Registering with etcd: '.red +
                        JSON.stringify(err));
                    this._registered = false;
                }
            );
        }
    };
    
    
    /**
    * (Internal) Helper function to find specifics services in Etcd Manager
    *
    * @param serviceKey  The Key to be found in the Etdc Manager
    * @param serviceName Friendly name to the service, only useful for logging
    * @param _cb         Callback function which will receive the service URL
    */
    this._serviceFinder = function (serviceKey, serviceName, _cb) {
        serviceName = serviceName || serviceKey;
        if (this._serviceManager) {
            var promise = this._serviceManager.findService(serviceKey);
    
            promise.then(
                function (url) {
                    var msg = serviceName + ' found at etcd.';
                    console.log(msg.green);
                    _cb(null, serviceKey, url);
                }, function (err) {
                    var msg = '[ERROR] Finding ' + serviceName + ' with etcd: ';
                    console.log(msg.red + JSON.stringify(err));
                    _cb(err);
                });
        } else {
            _cb(null);
        }
    }
    
    /**
    * Try to find the service host. It saves the URL.
    *
    * @function
    * @param {string} Service key name.
    * @param {string} Service alias.
    */
    this.findService = function (key, alias) {
        this._serviceFinder(key, alias, this.setServiceUrl);
    };
    
    /**
    * Try to get url retrieved by etcd.
    *
    * @function
    * @param {string} Service name.
    * @return {string} A url.
    */
    this.getServiceUrl = function (key) {
        return _services[key];
    };
    
    /**
    * Set url retrieved by etcd.
    *
    * @function
    * @param {string} Service key
    * @param {string} Service url.
    * @return {string} A url.
    */
    this.setServiceUrl = function (err, key, url) {
        if(!err) {
            _services[key] = url;
        }
    };
}
 
/* ************************************************************************
SINGLETON CLASS DEFINITION
************************************************************************ */
singleton.instance = null;
 
/**
 * Singleton getInstance definition
 * @return singleton class
 */
singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton();
    }
    return this.instance;
}
 
module.exports = singleton.getInstance();