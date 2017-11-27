const express = require('express');
const router = express.Router();

const passport = require('../../config/passport');
const Geetest = require('gt3-sdk');
const geetestConfig = require('../../config/password').geetest;
const captcha = new Geetest(geetestConfig);

router.post('/login', passport.authenticate('local-login'), (req, res, next) => {
  console.warn('login test');
});

module.exports = router;
