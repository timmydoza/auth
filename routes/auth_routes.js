var express = require('express');
var authRouter = express.Router();
var User = require(__dirname + '/../models/users');
var handleError = require(__dirname + '/../lib/handleError');
var bodyParser = require('body-parser');
var basicHTTP = require(__dirname + '/../lib/basicHTTP');

authRouter.post('/signup', bodyParser.json(), function(req, res) {
  User.findOne({'username': req.body.username}, function(err, dbuser) {
    if (dbuser) {
      return res.send('username already taken');
    } else {
      var user = new User();
      user.username = req.body.username;
      user.hashPassword(req.body.password);

      user.save(function(err) {
        if (err) return handleError(err, res);

        user.generateToken(function(err, token) {
          if (err) return handleError(err, res);
          res.json({token: token});
        });
      });
    }
  });
});

authRouter.get('/signin', basicHTTP, function(req, res) {
  if (!(req.auth.username && req.auth.password)) {
    res.status(401).send('bad login info');
  }

  User.findOne({'username': req.auth.username}, function(err, user) {
    if (err) return res.status(401).send('bad login info');
    if (!user) return res.status(401).send('bad login info');
    if (!user.comparePassword(req.auth.password)) return res.status(401).send('bad login info');

    user.generateToken(function(err, token) {
      if (err) return handleError(err, res);
      res.json({token: token});
    });
  });
});

module.exports = authRouter;
