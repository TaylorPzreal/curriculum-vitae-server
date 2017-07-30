const express = require('express');
const router = express.Router();
const blogDao = require('./dao');

router.get('/queryByTitleId/:titleId', (req, res, next) => {
  blogDao.queryByTitleId(req, res, next);  
});

router.get('/queryAll', (req, res, next) => {
  blogDao.queryAll(req, res, next);
});

router.get('/queryByPage/:page', (req, res, next) => {
  blogDao.queryByPage(req, res, next);
});

router.get('/queryTop10Hot', (req, res, next) => {
  blogDao.queryTop10Hot(req, res, next);
});

router.post('/edit', (req, res, next) => {
  blogDao.saveBlog(req, res, next);
});

router.get('/querySelf/:page', (req, res, next) => {
  blogDao.querySelf(req, res, next);
});

module.exports = router;
