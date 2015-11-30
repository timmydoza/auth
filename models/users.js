var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');

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

userSchema.methods.generateToken = function(callback) {
  var id = this._id;
  eat.encode({id: id}, process.env.APPSECRET, callback);
};

module.exports = mongoose.model('User', userSchema);
