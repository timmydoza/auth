var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.methods.hash = function(password, callback) {
  bcrypt.hash(password, 8, function(err, hash) {
    this.password = hash;
    callback(err);
  }.bind(this));
};

userSchema.methods.check = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.methods.generateToken = function(callback) {
  var id = this._id;
  eat.encode({id: id}, process.env.APPSECRET, callback);
};

module.exports = mongoose.model('User', userSchema);
