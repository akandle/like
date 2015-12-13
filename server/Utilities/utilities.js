var Profile = require('../models/profileModel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));

///////////// Authentication Related Utilities //////////////
module.exports.authenticateUser = function (req, res, next, passport) {
  passport.authenticate('local', function( err, user, info ) {
   if(user === false) {
    console.log('redirecting because user is false');
     res.redirect('/api/signin');
   } else {
    req.login(user.dataValues, function(err) {
      console.log('WE ARE LOGGING IN');
     if(err) {
       console.log('Error: ---', err);
     }
    });
    console.log('In authenticateUser ', req.session.passport);
    console.log('Util authenticate request user: ', req.user);
    console.log('Util authenticate request session: ', req.session);
    res.sendStatus(200);
   }
  })(req, res, next);
};

module.exports.isAuthorized = function(req, res, next){
  console.log('In isAuthorized ', req.session.passport);
  console.log('Util is authorized request user: ', req.user);
  console.log('Util is authorized request session: ', req.session);
  if (req.isAuthenticated()) {
     next();
    } else {
      res.sendStatus(401);
    }
};


////////////////// User Related Utilities //////////////////
module.exports.getProfile = function (username, userid) {
  console.log('in getProfile, username is ', username)
  if (userid !== null) {
    return Profile.find({ where : { id : userid }});
  } else {
    return Profile.find({ where : { username : username }});
  }
};

module.exports.checkUsername = function (req, res, next) {
  var username = req.body.username;
  Profile.find({ where: { username : username }})
        .then(function(user) {
          if(user === null) {
            next();
          } else {
            res.sendStatus(451);
          }
        })
        .catch(function(err){
          res.sendStatus(451);
        });
};

module.exports.createUser = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var userObj = {
    username  : username,
    password  : password,
    firstName : req.body.firstName,
    lastName  : req.body.lastName,
    email     : req.body.email
  };

  hashPassword(username, password)
    .then(function(hash){
      userObj.password = hash;
      return userObj;
    })
    .then(function(user) {
      return Profile.create(user)
        .then(function(user) {
          return user;
        });
    })
    .then(function(user) {
      req.login(user.dataValues, function(err) {
        if(err) {
          throw new Error('Error in logging in user...', err);
        }
      });
      res.sendStatus(200);
    })
    .catch(function(err){
      console.log('Error in creating User... ',err);
      res.send(451);
    });
};

module.exports.signUserOut = function (req, res, next) {
  // To remove req.user and destroy the passport session
  req.logout();

  // Destroying express session
  req.session.destroy();

  // Ensuring user is logged out of passport
  // if(req.session) {
  //   console.log('didnt work sucker');
  // } else {
  //   console.log('worked sucker');
  // }
  res.sendStatus(204);
};


///////////////// Password Related Utilities ////////////////
module.exports.checkPassword = function(username, password) {
  console.log('In checkPassword');
  return this.getProfile(username, null)
    .then(function(user){
      var username = user.dataValues.username;
      var pwd = user.dataValues.password;
      return bcrypt.compareAsync(password, pwd)
        .then(function(result) {
          console.log('Result of compareAsync is', result);
          return result;
        });
  })
  .catch(function(err) {
    console.log('err in checkPassword', err)
  })
};

function hashPassword (username, password) {
  return bcrypt.genSaltAsync(8)
    .then(function(salt) {
      return bcrypt.hashAsync(password, salt);
    })
    .then(function(hash) {
      return hash;
    })
    .catch(function(err){
      throw new Error('Error in hashing password...', err);
    });
}
