const express = require('express');
const router = express.Router();
const userDao = require('./users.dao');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// ADD
router.post('/add', (req, res, next) => {
  userDao.add(req, res, next);
});

// Query One
router.get('/query', (req, res, next) => {
  userDao.queryById(req, res, next);
});

// Query All
router.get('/queyAll', (req, res, next) => {
  userDao.queryAll(req, res, next);
});

// Delete
router.get('/delete', (req, res, next) => {
  userDao.delete(req, res, next);
});

// Update
router.post('update', (req, res, next) => {
  userDao.update(req, res, next);
});

module.exports = router;
