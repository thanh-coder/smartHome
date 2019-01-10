const router = require('express').Router();
const passport = require('passport');
const controller = require('../controller/index.controller');

// router.route('/').get(function(req, res) { res.render('smarthome') });
router.route('/')
  .get(controller.login)
  .post(passport.authenticate('local', { failureRedirect: '/', successRedirect: '/admin' }));

router.route('/admin')
  .get(controller.admin);

router.route('/logout')
  .get(controller.logout);

module.exports = router;