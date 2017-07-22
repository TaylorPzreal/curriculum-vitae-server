const express = require('express');
const router = express.Router();
const OAuthConfig = require('../../config/OAuthConfig');
const https = require('https');
const request = require('request');
const dao = require('./dao');

const passport = require('passport');

// router.get('/login', (req, res) => {
//   res.json('Login');
// });
router.get('/login/github', passport.authenticate('github'));
router.get('/login/github/return', passport.authenticate('github', {
  failureRedirect: '/'
}), (req, res) => {
  const userInfo = res.req.user._json;

  dao.queryUserByUid(userInfo.id).then((user) => {
    if (user) {
      // 不再更新用户信息，更新需要在本网站进行。
      // dao.updateUserById(userInfo);
    } else {
      dao.saveUser(userInfo);
    }

    req.session.user = user;
    console.warn(user);
    res.redirect('/');
  }).catch((err) => {
    throw err;
  });
});
router.get('/profile', (req, res) => {
  console.warn(req.session);
  if (req && req.session && req.session.user) {
    res.json({
      code: 2000,
      data: req.session.user,
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

// 前端页面直接发起重定向请求
// router.get('/loginWithGithub', (req, res, next) => {
//   const nowdate = (new Date()).valueOf();

//   let path = 'https://github.com/login/oauth/authorize';
//   path += `?client_id=${OAuthConfig.ClientID}`; 
//   path += `&scope=${OAuthConfig.Scope}`;
//   path += `&state=${nowdate}`;
//   path += `&redirect_uri=${OAuthConfig.CallbackURL}`;

//   res.redirect(path);
// });

router.get('/getGithubAccess', (req, response, next) => {

  const code = req.query.code;
  // const state = req.query.state;
  const headers = req.headers;
  // console.warn(code, req.query);
  headers.host = 'github.com';
  let path = '/login/oauth/access_token';
  path += `?client_id=${OAuthConfig.ClientID}`;
  path += `&client_secret=${OAuthConfig.ClientSecret}`;
  path += `&code=${code}`;

  // console.warn(path, 'path');

  const opts = {
    hostname: headers.host,
    port: 443,
    path,
    headers,
    method: 'POST'
  };

  https.request(opts, (res) => {
    res.setEncoding('utf8');

    res.on('data', (data) => {
      console.warn(data);
      const args = data.split('&');
      const tokenInfo = args[0].split('=');
      const token = tokenInfo[1];

      const url = `https://api.github.com/user?access_token=${token}`;
      const options = {
        url,
        headers: {
          'User-Agent': 'HoneyMorning'
        }
      };

      function callback (error, res, body) {
        const userInfo = JSON.parse(body);

        dao.queryUserByUid(userInfo.id).then((status) => {
          if (status) {
            // 不再更新用户信息，更新需要在本网站进行。
            // dao.updateUserById(userInfo);
          } else {
            dao.saveUser(userInfo);
          }

          response.redirect('/');
        }).catch((err) => {
          throw err;
        });
      }

      request(options, callback);
    });
  }).on('error', (err) => {
    console.error(err);
  }).end();
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    // req.session.user = null;
    // res.clearCookie('user', {});
    res.cookie('isLogin', 'false');
    res.json({
      code: 2000,
      data: null,
      msg: 'log out success'
    });
  });
});

module.exports = router;
