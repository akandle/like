var bcrypt = require('bcrypt');
var Profile = require('../models/profileModel');
var Promise = require('bluebird');

module.exports.checkPassword = function(userid, password) {
  this.getProfile(userid).then(function(user){
    console.log(user);
  });
};

module.exports.getProfile = function (userid) {
  Profile.findById(userid).then(function(user){
    if (!user) {
      console.log('Error');
    }
    return new Promise(function(resolve) {
      resolve(user);
    });
  });
};