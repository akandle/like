var Profile = require('../models/profileModel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));

///////////// Authentication Related Utilities //////////////

/**
 * authenticates the user using local strategy
 * @param  {Object}   req      Request Object
 * @param  {Object}   res      Response Object
 * @param  {Function} next     Not used in this instance
 * @param  {Object}   passport Configured Passport Object
 */
module.exports.authenticateUser = function (req, res, next, passport) {
  //TODO: Remove 'next' references, they are not used
  passport.authenticate('local', function ( err, user, info ) {
    if (user === false) {
      res.sendStatus(302);
    } else {
      req.login(user.dataValues, function (err) {
        if (err) {
          //TODO: Logger
          console.log('Error: ---', err);
        }
      });
      res.status(200).send(user.dataValues);
    }
  })(req, res, next);
};

/**
 * Middleware to check authenticated status. Sends unauthorized(401) if not logged in.
 * @param  {Object}   req  Request Object
 * @param  {Object}   res  Response Object
 * @param  {Function} next If authorized, pass to route handler
 */
module.exports.isAuthorized = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
};


////////////////// User Related Utilities //////////////////
/**
 * Retrieves profile based on username or ID
 * @param  {String} usernam
 * @param  {Number} userid
 * @param  {Boolean} privy    Used to determine the type of profile to return
 * @return {Object}          User Model instance
 */
module.exports.getProfile = function (username, userid, privy) {
  if (privy) {
    return Profile.find({ where : { id : userid }});
  } else {
    if (userid !== null) {
      return Profile.find({ where : { id : userid }});
    } else {
      return Profile.find({ where : { username : username }});
    }
  }
};

/**
 * Middleware to check if username is valid
 * @param  {Object}   req  Request Object
 * @param  {Object}   res  Response Object
 * @param  {Function} next Will pass through to route handler if name valid
 */
module.exports.checkUsername = function (req, res, next) {
  var username = req.body.username;
  //TODO: Might consider logging here, will check username attempts
  Profile.find({ where: { username : username }})
    .then(function (user) {
      if (user === null) {
        next();
      } else {
        res.sendStatus(451);
      }
    })
    .catch(function (err) {
      res.sendStatus(451);
    });
};

/**
 * Creates a new User Model instance and stores in DB
 * @param  {Object} req Request Object
 * @param  {Object} res Response Object
 */
module.exports.createUser = function (req, res) {
  //TODO: Need logging here
  var username = req.body.username;
  var password = req.body.password;

  var userObj = {
    username : username,
    password : password,
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    email : req.body.email
  };

  hashPassword(username, password)
    .then(function (hash) {
      userObj.password = hash;
      return userObj;
    })
    .then(function (user) {
      return Profile.create(user)
        .then(function (user) {
          return user;
        });
    })
    .then(function (user) {
      req.login(user.dataValues, function (err) {
        if (err) {
          //TODO: Logger
          throw new Error('Error in logging in user...', err);
        }
      });
      res.sendStatus(200);
    })
    .catch(function (err) {
      //TODO: Logger
      console.log('Error in creating User... ', err);
      res.send(451);
    });
};

/**
 * Logout User and destroy session
 * @param  {Object}   req  Request Object
 * @param  {Object}   res  Response Object
 * @param  {Function} next not used
 */
module.exports.signUserOut = function (req, res, next) {
  //TODO: Log this
  req.logout();
  req.session.destroy();
  //TODO: Change this
  res.redirect('http://www.google.com');
};

/**
 * Retrieve list of all user ids
 * @return {array} Array of all user ids
 */
module.exports.getAllProfiles = function () {
  return Profile
    .findAll({ attributes : ['id', 'username']})
    .then(function (users) {
      var profiles = [];
      for (var i = 0; i < users.length; i++ ) {
        profiles.push(users[i].dataValues);
      }
      return profiles;
    })
    .catch(function (err) {
      //TODO: Logger
      throw new Error('Error getting new users',err);
    });
};

///////////////// Password Related Utilities ////////////////

/**
 * Compare supplied password with stored hash
 * @param  {String} username
 * @param  {String} password
 * @return {Boolean}          Returns true/false if password and hash match
 */
module.exports.checkPassword = function (username, password) {
  return this.getProfile(username, null)
    .then(function (user) {
      var username = user.dataValues.username;
      var pwd = user.dataValues.password;
      return bcrypt.compareAsync(password, pwd)
        .then(function (result) {
          return result;
        });
  })
  .catch(function (err) {
    //TODO: Logger
    console.log('err in checkPassword', err);
  });
};

/**
 * @private Used to hash passwords
 * @param  {String} username
 * @param  {String} password
 * @return {String}          Hashed and Salted password
 */
function hashPassword (username, password) {
  return bcrypt.genSaltAsync(8)
    .then(function (salt) {
      return bcrypt.hashAsync(password, salt);
    })
    .then(function (hash) {
      return hash;
    })
    .catch(function (err) {
      //TODO: Logger
      throw new Error('Error in hashing password...', err);
    });
}
