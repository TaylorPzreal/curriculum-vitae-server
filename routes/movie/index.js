const express = require('express');
const router = express.Router();
const dao = require('./dao');

router.get('/queryByPage', (req, res, next) => {
  dao.queryByPage(req, res, next);
});

module.exports = router;
