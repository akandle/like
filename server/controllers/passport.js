var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/profileModel');
var util = require('../Utilities/utilities');

/**
 * Configuration for Passport local strategy
 * @param  {String} username
 * @param  {String} password
 * @param  {Function} done Used in passport to determine if authenticated
 * @return          Returns result of done, depending on if user is authenticated
 */
passport.use(new LocalStrategy(
  function (username, password, done) {
    util.getProfile(username, null)
      .then(function (user) {
        if ( user === null ) {
          return done( null, false, { message : 'Incorrect username' } );
        } else if (!util.checkPassword( username, password )) {
          return done( null, false, { message : 'Incorrect password.'});
        } else {
          return done( null, user );
        }
      })
      .catch(function (err) {
        if ( err ) {
          //TODO: Logger
          console.log('Error in LocalStrategy', err);
          return err;
        }
      });
  }
));

/**
 * Serialize user object into local session object
 * @param  {Object} user      User Object
 * @param  {function} callback Injected by Passport, args determine how user object serialized
 */
passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

/**
 * Deserialize user from info in local session object
 * @param  {Number} id  Same id used in passport.serializeUser callback
 * @param  {function} cb Injected by Passport to return user object from user id
 */
passport.deserializeUser(function (id, cb) {
  User.findById(id)
    .then(function (user, err) {
      cb(null, user);
    })
    .catch(function (err) {
      //TODO: Logger
      console.log('Deserializing error: ', err);
    });
});

module.exports = passport;