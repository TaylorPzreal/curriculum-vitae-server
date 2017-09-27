const express = require('express');
const router = express.Router();
const winston = require('winston');

/* GET home page. */
router.get('/', (req, res) => {
  winston.info('Request home page.');
  winston.info(process.env.NODE_ENV);
  res.send({status: 'success', user: req.user});
});

// 获取wechat access token
router.get('/wechat/getAccessToken', (req, res, next) => {
  res.send({
    code: 2000,
    data: req.cookies['access_token'],
    msg: 'success'
  });

  next();
});

router.post('/wechat/savejsapiTicket', (req, res, next) => {
  const p = req.body;

  res.cookie('jsapi_ticket', p.ticket);
  res.send({
    code: 2000,
    data: null,
    msg: 'set jsapi_ticket ok.'
  });
  next();
});

module.exports = router;
