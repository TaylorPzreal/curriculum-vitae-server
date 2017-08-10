const express = require('express');
const router = express.Router();
const winston = require('winston');

/* GET home page. */
router.get('/', (req, res) => {
  winston.info('Request home page.');
  winston.info(process.env.NODE_ENV);
  res.send({status: 'success', user: req.user});
});

module.exports = router;
