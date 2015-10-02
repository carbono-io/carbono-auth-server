'use strict';

/**
 * Helper methods to communicate with Account Manager server (Imperial)
 *
 * @module Bromelia Imperial Client
 */

var UserProfile = require('./user-profile');

/**
  * @callback BasicStrategyCallback
  *
  * Callback from BasicStrategy. It accepts a verified user or an error.
  *
  * @param {Object} err - An error, if it occurs. Null otherwise.
  * @param {Object|boolean} user - Object representing the verified user. If the
  * credentials are invalid, this parameter must be false.
  */
/**
   * Authenticates with Basic Strategy.
   *
   * @param {string} username - Username captured by BasicStrategy. Will be
   * verified at Imperial
   * @param {string} password - Password captured by BasicStrategy. Will be
   * verified at Imperial.
   * @param {BasicStrategyCallback} callback for BasicStrategy
   * @function
   */
exports.authenticate = function (username, password, callback) {
    var userHelper = new UserProfile();

    userHelper.getUserInfo({
        email: username,
    }).then(
        function (user) {
            if (user !== null) {
                // Make sure the password is correct
                userHelper.login({
                    email: username,
                    password: password,
                }).then(
                    function (user) {
                        if (user !== null) {
                            // Success
                            return callback(null, user);
                        } else {
                            return callback(null, false);
                        }
                    }, function (err) {
                        return callback(err);
                    }
                );
            } else {
                // No user found with that username
                return callback(null, false);
            }
        }, function (err) {
            console.log(err);
            if (err !== null) {
                return callback(err);
            }
        }
    );
};

/**
 * Find an user at account-manager (Imperial).
 *
 * @param {string} userId - user identifier
Add a comment to this line
 * @param {string} imperialPath - path to access Imperial
 * @return {Object} promise which will be resolved when an user was found, and
 will be rejected when an error occurs or when the id is invalid.
 * @function
 */
exports.findUser = function (userId, imperialPath) {
    var userHelper = new UserProfile(imperialPath);
    return userHelper.getProfile({code: userId});
};
