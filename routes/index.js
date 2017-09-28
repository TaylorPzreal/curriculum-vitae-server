const express = require('express');
const router = express.Router();
const winston = require('winston');
const request = require('request');
const crypto = require('crypto');
const wxConfig = require('../config/wechat');
const randomstring = require('randomstring');

/* GET home page. */
router.get('/', (req, res) => {
  winston.info('Request home page.');
  winston.info(process.env.NODE_ENV);
  res.send({
    status: 'success',
    user: req.user
  });
});

// 获取wechat access token
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const url = `https://api.wechat.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.AppID}&secret=${wxConfig.AppSecret}`;
    request.get(url, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response.statusCode === 200) {
        body = JSON.parse(body);
        resolve(body.access_token);
      } else {
        resolve(false);
      }
    });
  });
}

// 获取jsapi_token
function getTicket(token) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`;
    request.get(url, (err, response, body) => {
      if (err) {
        reject(err);
      }

      if (response.statusCode === 200) {
        body = JSON.parse(body);
        resolve(body.ticket);
      } else {
        resolve(false);
      }
    });
  });
}

router.post('/wechat/generate/signature', (req, res) => {
  const timestamp = parseInt(new Date().getTime() / 1000) + '';
  const noncestr = randomstring.generate(16); // Math.random().toString(36).substr(2, 15);
  const url = req.body.url; // local website url
  let jsapi_ticket = req.cookies.jsapi_ticket;
  let access_token = req.cookies.access_token;

  // 1 decide access_token whether exist
  if (!access_token && !jsapi_ticket) {
    getAccessToken()
      .then((token) => {
        // set token
        res.cookie('access_token', token);
        access_token = token;
        return getTicket(token);
      })
      .then((ticket) => {
        // set ticket
        res.cookie('jsapi_ticket', ticket);
        jsapi_ticket = ticket;

        res.send({
          code: 2000,
          data: {
            noncestr,
            timestamp,
            signature:  generateSignature(jsapi_ticket, noncestr, timestamp, url)
          },
          msg: 'success'
        });
      })
      .catch((err) => {
        console.error(err);
      });

  } else {
    // Exist redirect regenerate.
    res.send({
      code: 2000,
      data: {
        noncestr,
        timestamp,
        signature:  generateSignature(jsapi_ticket, noncestr, timestamp, url)
      },
      msg: 'success'
    });
  }
});

// 生成签名
function generateSignature(ticket, noncestr, timestamp, url) {
  const strTmp = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  const signature = sha1(strTmp);

  return signature;
}

// sha1加密
function sha1(str) {
  console.warn(str);
  const shasum = crypto.createHash('sha1');
  shasum.update(str);
  str = shasum.digest('hex');

  console.warn(str);
  return str;
}

module.exports = router;
