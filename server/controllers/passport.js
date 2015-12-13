var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/profileModel');
var util = require('../Utilities/utilities')

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('In passport, username is', username)
    console.log('In passport, password is', password)
    util.getProfile(username, null)
        .then(function(user) {
            console.log('in Passport, user is...', user);
            if ( user === null ) {
              console.log('no user found');
              return done( null, false, { message : 'Incorrect username' } );
            } else if (!util.checkPassword( username, password )) {
              console.log('Password is good')
              return done( null, false, { message : 'Incorrect password.'});
            } else {
              return done( null, user );
            }
         })
         .catch(function(err){
           if ( err ) {
             console.log('Error');
             return err;
           }
         })
  }
 ));

passport.serializeUser(function(user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id)
    .then(function(user, err) {
      console.log('Deserializing user');
      cb(null, user);
    })
    .catch(function(err) {
      console.log('Deserializing error: ',err);
    });
});

module.exports = passport;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.find({where:{username : username}})
//         .then(function(user, err) {
//             if ( err ) {
//               console.log('Error');
//               return err;
//             }
//             if ( !user ) {
//               console.log('no user found');
//               return done( null, false, { message : 'Incorrect username' } );
//             }
//             if (util.checkPassword( username, password )) {
//               return done( null, false, { message : 'Incorrect password.'});
//             }
//             return done( null, user );
//          });
//   }
//  ));
