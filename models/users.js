var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.hashPassword = function(password) {
  var hashedPassword = this.password = bcrypt.hashSync(password, 8);
  return hashedPassword;
};

userSchema.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

exports = mongoose.model('User', userSchema);
