/*jshint expr: true*/
var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('supertest');
var server = require('../../server/server.js');

//Special login procedure allowing the passing of sessions id through cookies
var logIn = function (callback, done) {
  var agent = request.agent(server);

  agent
    .post('/api/signin')
    .send( {username: 'John',
            password: 'test'})
    .end(function (err, res) {
      if (err) {
        done(err);
      } else {
        callback(agent, res);
        done();
      }
    });
};

describe('API - Vote', function () {
  it('Should return 200 when posting to /api/vote, while logged in', function (done) {
    var checkingAuthorization = function (agent, res) {
      console.log('Accessing secured resources while signed into service');
      agent
        .post('/api/vote')
        .expect(200);
    };

    logIn(checkingAuthorization, done);

  });

  it('Should return 401 when POST/GET to /api/vote when not logged in', function (done) {
    request(server)
      .post('/api/vote')
      .end(function (err, res) {
        if (err) {
          console.log('Error in test: ', err);
        } else {
          expect(res.statusCode).to.equal(401);
          request(server)
            .get('/api/vote')
            .expect(401, done);
        }
      });

  });
});

describe('API - Profile', function () {
  describe('GET api/profile/:id', function () {
    it('should respond with a profile object and a 200 status when logged in', function (done) {
      var retrieveProfile = function (agent, res) {
        console.log('Accessing profile by ID while signed into service');
        expect(res.statusCode).to.equal(200);
        agent
          .get('/api/profile/1')
          .end(function (err, res) {
            if (err) {
              console.log('Error in test: ', err);
            } else {
              expect(res.statusCode).to.equal(200);
              expect(res.body.id).to.equal(1);
              expect(res.body.username).to.equal('John');
            }
          });
      };

      logIn(retrieveProfile, done);
    });

    it('should respond with 404 and no profile object for unknown user when logged in', function (done) {
      var retrieveProfile = function (agent, res) {
        console.log('Accessing profile by ID while signed into service');
        expect(res.statusCode).to.equal(200);
        agent
          .get('/api/profile/1000')
          .end(function (err, res) {
            if (err) {
              console.log('Error in test: ', err);
            } else {
              expect(res.statusCode).to.equal(404);
              expect(res.body.id).to.be.undefined;
              expect(res.body.username).to.be.undefined;
              // expect(res.body.username).to.equal('John');
            }
          });
      };

      logIn(retrieveProfile, done);
    });

    it('Should respond with a 401 when POST/GET api/profile/anyid# when not logged in', function (done) {
      request(server)
        .get('/api/profile/1')
        .end(function (err, res) {
          if (err) {
            console.log('Error in test: ', err);
          } else {
            expect(res.statusCode).to.equal(401);
            request(server)
              .get('/api/profile/1000')
              .expect(401, done);
          }
        });
      });
  });

  describe('API - Browse', function () {

    it('should respond with a list of profile IDs and a 200 status when logged in', function (done) {
      var retrieveProfile = function (agent, res) {
        console.log('Accessing browse while signed into service');
        expect(res.statusCode).to.equal(200);
        agent
          .get('/api/browse')
          .end(function (err, res) {
            if (err) {
              console.log('Error in test: ', err);
            } else {
              expect(res.statusCode).to.equal(200);
              expect(res.body[0].id).to.equal(1);
              // expect(res.body[1].id).to.be.an('number');
            }
          });
      };
      logIn(retrieveProfile, done);
    });

    it('Should respond with a 401 when GET request sent to api/browse when not logged in', function (done) {
      request(server)
        .get('/api/browse')
        .expect(401, done);
      });

  });
});
console.log("API Spec END +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
