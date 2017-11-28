const express = require('express');
const router = express.Router();

const passport = require('../../config/passport');
const Geetest = require('gt3-sdk');
const geetestConfig = require('../../config/password').geetest;
const captcha = new Geetest(geetestConfig);
const AccountModel = require('../../models/account.model');

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info, status) => {
    if (user) {
      res.cookie('isLogin', 'true'); // set login cookie

      req.login(user, err => {
        if (err) {
          console.error('Login serializeUser false');
          console.error(err);
        }
      });

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

router.get('/logout', (req, res) => {
  req.logOut(); // make req.user = null
  req.session.destroy(() => {
    res.clearCookie('sessionId', {});
    res.clearCookie('isLogin', {});
    res.json({
      code: 2000,
      data: null,
      msg: 'Log out success'
    });
  });
});

router.post('/signup', (req, res, next) => {
  console.warn(req.body);
  const param = req.body;
  if (!param.name || !param.email || !param.password) {
    res.json({
      code: 9001,
      data: null,
      msg: 'All input box you can not be null'
    });
  }

  // validate name exist
  AccountModel.findOne({
    where: {
      name: param.name
    }
  }).then((result) => {
    if (result && result.dataValues) {
      res.json({
        code: 9002,
        data: null,
        msg: 'name has exist'
      });
    } else {
      return false;
    }
  }).catch((err) => {
    console.error(err);
  });
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
