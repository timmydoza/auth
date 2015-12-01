var User = require(__dirname + '/../models/users');

module.exports = function(req, res, next) {
  User.findOne({'username': req.body.username}, function(err, dbuser) {
    if (dbuser) {
      return res.status(401).send('username already taken');
    } else {
      next();
    }
  });
};
