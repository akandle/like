var morgan = require('morgan');
var express = require('express');
var body_parser = require('body-parser');
// var profileAPI = require('/profileAPI.js');

var app = express();


// var router = express.Router();


//   var authRouter = express.Router();
//   var voteRouter = express.Router();
//   var profileRouter = express.Router();

  app.use(morgan('dev'));
  app.use(body_parser.urlencoded({extended : true}));
  app.use(body_parser.json());
  app.use(express.static('public'));

  // router.get('/api', profileAPI)

  app.use('/api/profile/:id', function (request, response) {
    console.log(request.params.id);
    if (request.params.id  == 20) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  });

  app.use('/api/browse', function (request, response) {
     response.sendStatus(200);
  });

  app.use('/api/signin', function(req, res){
    //Initializing response to 200 pending passport integration
    res.sendStatus(200);
  });

  app.use('/api/signout', function(req, res){
    //Initializing response to 200 pending passport integration
    res.sendStatus(200);
  });
  
  app.use('/api/user/create', function(req, res){
    res.sendStatus(200);
  });

  app.use('/api/vote', function (req, res){
    res.sendStatus(200);
  });

app.listen(3333);
module.exports = app;