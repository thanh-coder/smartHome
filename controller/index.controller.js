const fakeDataModel = require('../model/fakeData.model');
const passport = require('passport');

exports.login = async (req, res) => {
  if(req.isAuthenticated()) {
    res.redirect('/admin');
  } else {
    res.render('login');
  }
}

// exports.admin = async (req, res) => {
//   const chartsData = await fakeDataModel.find({});
//   if(req.isAuthenticated()) {
//     res.render('smarthome', {data: chartsData});
//   } else {
//     res.redirect('/');
//   }
// }

exports.admin = async (req, res) => {
  const chartsData = await fakeDataModel.find({});
    res.render('smarthome', {data: chartsData});
  
}

exports.logout = async (req, res) => {
  req.logout();
  res.redirect('/');
}