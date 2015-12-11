var bcrypt = require('bcrypt');
var Profile = require('../models/profileModel');
var Promise = require('bluebird');

module.exports.checkPassword = function(userid, password) {
  this.getProfile(userid)
      .then(function(user){

      });
};

module.exports.storePassword = function() {

}

module.exports.getProfile = function (userid) {
  return new Promise(function(resolve, reject){
    Profile.findById(userid).then(function(user){
      if (!user) {
        throw new Error("User not found");
      } else {
        resolve(user);
      }
    });
  });
};

function hashPassword (password, salt) {

}
