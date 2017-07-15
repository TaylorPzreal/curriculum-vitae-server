const express = require('express');
const router = express.Router();
const OAuthConfig = require('../../config/OAuthConfig');
const https = require('https');
// const dao = require();

router.get('/loginWithGithub', (req, res, next) => {
  // 第一步：重定向到Github
  const nowdate = (new Date()).valueOf();

  let path = 'http://github.com/login/oauth/authorize';
  path += `?client_id=${OAuthConfig.ClientID}`;
  path += `&scope=${OAuthConfig.Scope}`;
  path += `&state=${nowdate}`;

  res.redirect(path);
});

router.get('/getGithubAccess', (req, response) => {

  // 第二步：获取token
  // new Promise((resolve, reject) => {
  //   const code = req.query.code;
  //   // const state = req.query.state;
  //   const headers = req.headers;
  //   headers.host = 'github.com';
  //   let path = '/login/oauth/access_token';
  //   path += `?client_id=${OAuthConfig.ClientID}`;
  //   path += `&client_secret=${OAuthConfig.ClientSecret}`;
  //   path += `&code=${code}`;

  //   const opts = {
  //     hostname: headers.host,
  //     port: 443,
  //     path,
  //     headers,
  //     method: 'POST'
  //   };

  //   https.request(opts, (res) => {
  //     res.setEncoding('utf8');

  //     res.on('data', (data) => {
  //       const args = data.split('&');
  //       const tokenInfo = args[0].split('=');
  //       const token = tokenInfo[1];
  //       console.warn('token===================', token);
  //       resolve(token);
  //     });
  //   }).on('error', (err) => {
  //     console.warn(err);
  //     reject(err);
  //   });

  // })
  //   .then((token) => {
  //     console.warn(token, 'token----------------------------------------------------------');

  //     // 第三步：获取用户基本信息
  //     const url = `https://api.github.com/user?access_token=${token}`;
  //     console.warn(url);

  //     https.get(url, (res) => {
  //       res.on('data', (userInfo) => {
  //         console.warn('获取GITHUB用户基本信息');
  //         console.warn(userInfo);
  //         // response.send(userInfo);
  //       });
  //     }).on('error', (err) => {
  //       console.error(err);
  //     });
  //   })
  //   .catch((reason) => {
  //     console.error(reason);
  //   });

  const code = req.query.code;
  // const state = req.query.state;
  const headers = req.headers;
  headers.host = 'github.com';
  let path = '/login/oauth/access_token';
  path += `?client_id=${OAuthConfig.ClientID}`;
  path += `&client_secret=${OAuthConfig.ClientSecret}`;
  path += `&code=${code}`;

  const opts = {
    hostname: headers.host,
    port: 443,
    path,
    headers,
    method: 'POST'
  };

  const request = https.request(opts, (res) => {
    res.setEncoding('utf8');

    res.on('data', (data) => {
      const args = data.split('&');
      const tokenInfo = args[0].split('=');
      const token = tokenInfo[1];

      const url = `https://api.github.com/user?access_token=${token}`;
      console.warn(url);

      https.get(url, (res) => {
        res.on('data', (userInfo) => {
          console.warn('获取GITHUB用户基本信息');
          console.warn(userInfo);
          // response.send(userInfo);
          process.stdout.write(userInfo);
        });
      }).on('error', (err) => {
        console.error(err);
      }).end();
    });
  });
  request.on('error', (err) => {
    console.error(err);
  });
  request.end();
});

module.exports = router;
