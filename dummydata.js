var db = require('./DB/db');
var User = require('./server/models/profileModel');
var bcrypt = require('bcrypt');

var passHash = bcrypt.hashSync('test', 8);

User.create({ username : 'John',
              password: passHash});

// User.create({ username : 'Sally' });

var fnames = ['Jose', 'David', 'Mike', 'Jordan', 'Brett'];

var lnames = ['Johnson', 'Davidson', 'Favre', 'VanDeCamp', 'Doleson'];

var domains = ['netscape.com', 'aol.com', 'gmail.com', 'hotmail.com', 'hr.net'];

var firstNames = [];
var lastNames = [];
var emails = [];
var usernames = [];
var passwords = [];

for(var i =1; i <= 20; i++) {
  for(var j = 0; j < 5; j ++) {
    var first_name = fnames[(Math.floor(Math.random() * 5))];
    var last_name = lnames[(Math.floor(Math.random() * 5))];
    var domain = domains[(Math.floor(Math.random() * 5))];
    firstNames.push(first_name);
    lastNames.push(last_name);
    emails.push(firstNames + '@' + domain);
    usernames.push(first_name + '' + ((j+1)*(i*5-5)));
    passwords.push('test' + (j*i + 1)); 
  }
}

console.log(firstNames);
console.log(lastNames);
console.log(emails);
console.log(usernames);
console.log(passwords);