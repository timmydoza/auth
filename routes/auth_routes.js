var express = require('express');
var authRouter = express.Router();
var User = require(__dirname + '/../models/users');
var handleError = require(__dirname + '/../lib/handleError');
var bodyParser = require('body-parser');
var basicHTTP = require(__dirname + '/../lib/basicHTTP');
var async = require('async');
var checkUser = require(__dirname + '/../lib/check_user');

authRouter.post('/signup', bodyParser.json(), checkUser, function(req, res) {
  var user = new User();
  user.username = req.body.username;

  async.waterfall([
    function bcrypt(callback) {
      user.hash(req.body.password, callback);
    },
    function saveUser(callback) {
      user.save(callback);
    },
    function generateToken(arg1, arg2, callback) {
      user.generateToken(callback);
    }
  ], function(err, token) {
    if (err) return handleError(err, res);
    res.json({token: token});
  });
});

authRouter.get('/signin', basicHTTP, function(req, res) {
  async.waterfall([
    function findUser(callback) {
      User.findOne({'username': req.auth.username}, callback);
    },
    function checkHash(user, callback) {
      if (!user) return callback(new Error('no user'));
      this.user = user;
      user.check(req.auth.password, callback);
    },
    function sendToken(correctPassword, callback) {
      if (!correctPassword) return callback(new Error('incorrect password'));
      this.user.generateToken(callback);
    }
  ], function(err, result) {
    if (err) return res.status(401).send('bad login info');
    res.json({token: result});
  });
});

module.exports = authRouter;
