const express = require('express');
const router = express.Router();
const OAuthConfig = require('../../config/OAuthConfig');
const https = require('https');
// const dao = require();

router.get('/loginWithGithub', (req, res, next) => {
  const nowdate = (new Date()).valueOf();

  let path = 'http://github.com/login/oauth/authorize';
  path += `?client_id=${OAuthConfig.ClientID}`; 
  path += `&scope=${OAuthConfig.Scope}`;
  path += `&state=${nowdate}`;

  res.redirect(path);
});

router.get('/getGithubAccess', (req, res, next) => {

  const code = req.query.code;
  const state = req.query.state;
  const headers = req.headers;
  headers.host = 'github.cm';
  let path = '/login/oauth/access_token';
  path += `?client_id=${OAuthConfig.ClientID}`;
  path += `&client_secret=${OAuthConfig.ClientSecret}`;
  path += `&code=${code}`;

  console.warn(path, 'path');

  const opts = {
    hostname: headers.host,
    port: 443,
    path,
    headers,
    method: 'POST'
  };

  https.request(opts, (res) => {
    res.setEncoding('utf8');

    console.warn(opts);

    res.on('data', (data) => {
      console.warn(data);
      const args = data.split('&');
      const tokenInfo = args[0].split('=');
      const token = tokenInfo[1];

      const url = `https://api.github.com/user?access_token=${token}&scope=user`;
      https.get(url, (res) => {
        res.on('data', (userInfo) => {
          console.warn(userInfo);
        });
      });
    });
  });
});

module.exports = router;
