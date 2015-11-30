var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.hashPassword = function(password) {
  var hashedPassword = this.password = bcrypt.hashSync(password, 8);
  return hashedPassword;
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
