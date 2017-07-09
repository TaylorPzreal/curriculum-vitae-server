const express = require('express');
const router = express.Router();
const blogDao = require('./blog.dao');

router.get('/queryByTitleId', (req, res, next) => {
  blogDao.queryByTitleId(req, res, next);  
});

router.get('/queryAll', (req, res, next) => {
  blogDao.queryAll(req, res, next);
});

module.exports = router;
