const express = require('express');
const router = express.Router();
const dao = require('./dao');

router.post('/add', (req, res, next) => {
  dao.add(req, res, next);
});

router.get('/queryMore/:page', (req, res, next) => {
  dao.queryMore(req, res, next);
});

router.get('/changeCollection', (req, res, next) => {
  dao.queryMore(req, res, next);
});

module.exports = router;
