const express = require('express');
const router = express.Router();

const passport = require('../../config/passport');
const Geetest = require('gt3-sdk');
const geetestConfig = require('../../config/password').geetest;
const captcha = new Geetest(geetestConfig);

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/v1/auth/profile',
    // failureRedirect: '/v1/auth/login',
    // failureFlash: true
  }),
  (req, res, next) => {
    console.warn('login test');
    console.warn(req);
  }
);

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
