const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('accounts', userSchema, 'accounts');

