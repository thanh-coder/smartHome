const mongoose = require('mongoose');

const fakeData_Schema = new mongoose.Schema({
  temp: Number,
  hum: Number,
  date:{ type: Date, default: Date.now }

});

module.exports = mongoose.model('fakedata', fakeData_Schema,);