var Profile = require('../models/profileModel');
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));

////////////////// User Related Utilities //////////////////
module.exports.getProfile = function (username) {
  return new Promise(function(resolve, reject){
    Profile.find({ where : { username : username }})
           .then(function(user){
              if (!user) {
                throw new Error("User not found");
              } else {
                resolve(user);
              }
           });
  });
};

module.exports.checkUsername = function (req, res, next) {
  var username = req.body.username;
  console.log('Finding in checkUsername. User is ',username);
  Profile.find({ where: { username : username }})
        .then(function(user) {
          console.log('Found, user is ', user);
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
  console.log('inside create user');
  var username = req.body.username;
  var password = req.body.password;

  console.log('user and pass: ', username, ' ', password);
  var userObj = {
    username  : username,
    password  : password,
    firstName : req.body.firstName,
    lastName  : req.body.lastName,
    email     : req.body.email
  };

  hashPassword(username, password)
    .then(function(hash){
      console.log('Password has been hashed, it is:', hash);
      // console.log('#1!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      userObj.password = hash;
      console.log('user object', userObj);
      return userObj;
    })
    .then(function(user) {
      console.log('User incomeing to create: ', user);

      return Profile.create(user)
        .then(function(user) {
          return user;
        });
    })
    // .then(Profile.create(user))
    .then(function(user) {
      console.log('incoming user to req.login: ', user);
      req.login(user.dataValues, function(err) {
        if(err) {
          // console.log('Error: ---', err);
          throw new Error('I dont know');
        }
      });
      res.sendStatus(200); //next()
    })
    .catch(function(err){
      console.log('Error: ',err);
      res.send(451);
    });
};


///////////////// Password Related Utilities ////////////////
module.exports.checkPassword = function(username, password) {
  return this.getProfile(username)
    .then(function(user){
      var username = user.dataValues.username;
      var pwd = user.dataValues.password;
      console.log('username: ',username);
      console.log('password: ', pwd);
      bcrypt.compareAsync(password, pwd)
        .then(function(err, result) {
          return result;
        });
});
};

function hashPassword (username, password) {
  console.log('Inside hashPassword. Username  is ', username);
  console.log('Inside hashPassword. Passowrd is ', password);
  return bcrypt.genSaltAsync(8)
    .then(function(salt) {
      console.log('crypting shit yo');
      return salt;
    })
    .then(function(salt) {
      console.log('salt is: ', salt);
      return bcrypt.hashAsync(password, salt);
    })
    .then(function(hash) {
      console.log('hash is: ', hash);
      return hash;
    });
}
// function hashPassword (username, password) {
//   return new Promise (function(resolve, reject) {
//     bcrypt.genSaltAsync(8)
//         .then(function(salt) {
//           return bcrypt.hashAsync(password ,salt);
//         })
//         .then(function(hash) {
//           return hash;
//         })
//         .catch(function(err){
//           reject(err);
//         });
//   });
// }

// TODO: Write checkUsername function

// TODO: Write to potential features
          //Autocomplete feature to check valid usernames
          //as prospective user is signing up (real-time data from db)

// TODO: Write to notes. txt
            //When reading source code, start with only the functions
            //you're intending to use. Ignore complexity.

            //Look at a library's usage history. If its issue history
            //

// module.exports.createUser = function (req, res, next) {
//   var username = req.body.username;
//   var password = req.body.password;

//   console.log('')

//   var userObj = {
//     username  : username,
//     password  : '',
//     firstName : req.body.firstName,
//     lastName  : req.body.lastName,
//     email     : req.body.email
//   };

//   hashPassword(username, password)
//           .then(function(hash){
//             userObj.password = hash;
//             Profile.create(userObj)
//                    .then(function(user) {
//                      req.login(user.dataValues, function(err) {
//                        if(err) {
//                          console.log('Error: ---', err);
//                        }
//                      });
//                      res.send(200); //next()
//                    });
//           })
//           .catch(function(err){
//             console.log('Error: ',err);
//             res.send(451);
//           });
// };
