var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('supertest');
var server = require('../../server/server.js');

var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  "username": "John",
  "password": "test"
};

var login = function (request, done) {
  request
    .post('/api/login')
    .send(theAccount)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};

describe('Authentication', function() {
  describe('Log In', function () {
    it('should return a 200 on succesful signin', function (done) {
        request(server)
          .post('/api/signin')
          .send({username: 'John', password: 'test'})
          .expect(200, done); //TODO: Add in check of return value
    });

    it('should return a 302 (redirection) on signin failure', function (done) {
        request(server)
          .post('/api/signin')
          .send({username: 'Nottoday', password: 'test'})
          .expect(302, done); //TODO: Add in check of return value
    });

    it('should create new session', function (done) { //TODO: Login and get browse, logout and get browse, unlogged in ever get browse
      request(server)
        .post('/api/signin')
        .send({username: 'John', password: 'test'})
        .end(function(err, res) {
          console.log('response object: ',res);
        });
    });
  });
})
// var request = require('supertest')(app);
// var login = require('./login');

describe('MyApp', function () {

  var agent;

  before(function (done) {
    login(request, function (loginAgent) {
      agent = loginAgent;
      done();
    });
  });

  it('should allow access to admin when logged in', function (done) {
    var req = request.get('/api/browse');
    agent.attachCookies(req);
    req.expect(200, done);
  });

});

//   describe('Log Out', function () {

//     it('should destroy existing passport session', function (done) {
//     });
//     it('should destroy existing express session', function (done) {
//     });
//     it('should redirect to /api/signin', function (done) {
//     });
//   });
// });