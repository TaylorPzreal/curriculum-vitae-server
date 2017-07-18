const express = require('express');
const router = express.Router();
const blogDao = require('./dao');

router.get('/queryByTitleId', (req, res, next) => {
  blogDao.queryByTitleId(req, res, next);  
});

router.get('/queryAll', (req, res, next) => {
  blogDao.queryAll(req, res, next);
});

router.get('/queryByPage', (req, res, next) => {
  blogDao.queryByPage(req, res, next);
});

router.get('/queryTop10Hot', (req, res, next) => {
  blogDao.queryTop10Hot(req, res, next);
});

module.exports = router;
