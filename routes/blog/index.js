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
  const p = req.body;
  if (p.id) {
    blogDao.updateBlog(req, res, next);
  } else {
    blogDao.saveBlog(req, res, next);
  }
});

router.get('/querySelf/:page', (req, res, next) => {
  blogDao.querySelf(req, res, next);
});

/**
 * 标签统计分析
 */
router.get('/tagStatistic', (req, res, next) => {
  blogDao.tagStatistic(req, res, next);
});

/**
 * 月blog数统计分析
 */
router.get('/monthBlogs', (req, res, next) => {
  blogDao.monthBlogs(req, res, next);
});

module.exports = router;
