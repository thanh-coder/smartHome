const mongoose = require('mongoose');

const fakeData_Schema = new mongoose.Schema({
  for: String,
  data: String
}, {collection: 'fakeData'});

module.exports = mongoose.model('fakeData', fakeData_Schema);