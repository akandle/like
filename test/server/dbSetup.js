var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

//Create base database setup, with one user
console.log('==============Creating initial empty database==================');
var db = require('../../DB/db.js');
var Profile = require('../../server/models/profileModel');
var locationModel = require('../../server/models/locationModel');
var traitModel = require('../../server/models/traitModel');
var voteModel = require('../../server/models/voteModel');

console.log('==============Adding user: John, with pass "test" ==================');

//Wait 30 seconds
var testUser = function () {
  var passHash = bcrypt.hashSync('test', 8);

  Profile
    .create({ username : 'John',
              password : passHash})
    .then(function (user) {
      return console.log('USER IS THIS NOW: ', user);

    })
    .catch(function (err) {
      console.log('error: ', err);
    });
};

setTimeout(testUser, 5000);

// console.log('USER IS: +=+=+=+=+=+= ', Profile.find({where: {username: "John"}}).then(function(user) { return user;}).catch(function(err){return err;}));
