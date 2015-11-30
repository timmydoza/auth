var eat = require('eat');
var User = require(__dirname + '/../models/users');

module.exports = function(req, res, next) {
  var token = req.headers.token || req.body? req.body.token : '';
  if (!token) return res.status(401).send('bad login info');

  eat.decode(token, process.env.APPSECRET, function(err, token) {
    if (err) return res.status(401).send('bad login info');
    User.findOne({_id: token.id}, function(err, user) {
      if (err) return res.status(401).send('bad login info');
      if (!user) return res.status(401).send('bad login info');
      req.user = user;
      next();
    });
  });
};
