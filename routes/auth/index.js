const express = require('express');
const router = express.Router();

const passport = require('../../config/passport');
const AccountModel = require('../../models/account.model');

const Geetest = require('gt3-sdk');
const geetestConfig = require('../../config/password').geetest;
const captcha = new Geetest(geetestConfig);

// Geetest
router.get('/gt/register', (req, res, next) => {
  return captcha.register({
    client_type: 'unknown',
    ip_address: 'unknown'
  }, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    if (!data.success) {

      // failback
      req.session.fallback = true;
      res.send(data);
    } else {
      req.session.fallback = false;

      res.send({
        code: 2000,
        data,
        msg: 'success'
      });
    }
  });
});

router.post('/gt/validate', (req, res, next) => {
  return captcha.validate(req.session.fallback, {

    geetest_challenge: req.body.geetest_challenge,
    geetest_validate: req.body.geetest_validate,
    geetest_seccode: req.body.geetest_seccode

  }, (err, success) => {
    if (err) {
      res.send({
        code: 4000,
        data: null,
        msg: err
      });
    } else if (!success) {
      res.send({
        code: 9001,
        data: null,
        msg: 'Validate false'
      });
    } else {
      res.send({
        code: 2000,
        data: null,
        msg: 'Validate success'
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info, status) => {
    if (user) {
      // res.cookie('isLogin', 'true'); // set login cookie

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
  req.isAuthenticated();
  req.user;
  req.session.destroy(() => {
    res.clearCookie('sessionId', {});
    // res.clearCookie('isLogin', {});
    res.json({
      code: 2000,
      data: null,
      msg: 'Log out success'
    });
  });
});

function hasExistName(name) {
  return AccountModel.findOne({
    where: {
      name
    }
  }).then((result) => {
    if (result && result.dataValues) {
      return true;
    } else {
      return false;
    }
  }).catch((err) => {
    console.error(err);
  });
}

function hasExistEmail(email) {
  return AccountModel.findOne({
    where: {
      email
    }
  }).then((result) => {
    if (result && result.dataValues) {
      return true;
    } else {
      return false;
    }
  }).catch((err) => {
    console.error(err);
  });
}

router.post('/signup', async(req, res, next) => {
  const param = req.body;

  if (!param.name || !param.email || !param.password) {
    res.json({
      code: 9001,
      data: null,
      msg: 'All items you must input not null'
    });
  }

  // validate name exist
  const hasName = await hasExistName(param.name);
  if (hasName) {
    res.json({
      code: 9002,
      data: null,
      msg: 'name has exist'
    });
  } else {
    const hasEmail = await hasExistEmail(param.email);
    if (hasEmail) {
      res.json({
        code: 9003,
        data: null,
        msg: 'email has exist'
      });
    } else {
      AccountModel.create({
        uid: `hm${new Date().valueOf()}`,
        name: param.name,
        email: param.email,
        password: param.password
      });

      res.json({
        code: 2000,
        data: null,
        msg: 'Sign up success'
      });
    }
  }
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
