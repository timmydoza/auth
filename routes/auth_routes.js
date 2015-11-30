var express = require('express');
var authRouter = express.Router();
var User = require(__dirname + '/../models/users');
var handleError = require(__dirname + '/../lib/handleError');
var bodyParser = require('body-parser');


authRouter.post('/signup', bodyParser.json(), function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.hashPassword(req.body.password);

  user.save(function(err) {
    if (err) return handleError(err, res);

    res.send(user.username + 'added');
  });
});

authRouter.get('/signin', function(req, res) {


});

module.exports = authRouter;
