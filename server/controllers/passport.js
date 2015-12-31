var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models/schema');
var util = require('../Utilities/utilities');

/**
 * Configuration for Passport local strategy
 * @param  {String} username
 * @param  {String} password
 * @param  {Function} done Used in passport to determine if authenticated
 * @return          Returns result of done, depending on if user is authenticated
 */
passport.use(new LocalStrategy(
  function(username, password, done) {
    var globalUser;
    util.getProfile(username, null)
      .then(function (user) {
        if ( user === null ) {
          return done( null, false, { message : 'Incorrect username' } );
        }
        globalUser = user;
        console.log('User\'s ID is: ', user.get('id'));
        return util.checkPassword(user.get('id'), password);
      })
      .then(function(exist) {
        if (exist === false) {
          return done( null, false, { message : 'Incorrect password.'});
        } else {
          return done( null, globalUser);
        }
      })
      .catch(function (err) {
        if ( err ) {
          //TODO: Logger
          console.log('Error in LocalStrategy', err);
          return err;
        }
      });
    }));

/**
 * Serialize user object into local session object
 * @param  {Object} user      User Object
 * @param  {function} callback Injected by Passport, args determine how user object serialized
 */
passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.Profile.findById(id)
    .then(function(user, err) {
      cb(null, user);
    })
    .catch(function (err) {
      //TODO: Logger
      console.log('Deserializing error: ', err);
    });
});

module.exports = passport;