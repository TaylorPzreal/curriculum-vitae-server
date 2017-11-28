const express = require('express');
const router = express.Router();

const passport = require('../../config/passport');
const Geetest = require('gt3-sdk');
const geetestConfig = require('../../config/password').geetest;
const captcha = new Geetest(geetestConfig);

router.post('/login', (req, res, next) => {
  return passport.authenticate('local-login', (err, user, info, status) => {
  if (user) {
    res.send({
      code: 2000,
      data: user,
      msg: 'Login success'
    });
  } else {
    res.send({
      code: 9000,
      data: null,
      msg: info
    });
  }
  })(req, res, next);
});

router.get('/profile', (req, res) => {
  if (req && req.session && req.user) {
    res.json({
      code: 2000,
      data: req.user,
      msg: 'success'
    });
  } else {
    res.json({
      code: 4000,
      data: null,
      msg: 'not login'
    });
  }
});

module.exports = router;
