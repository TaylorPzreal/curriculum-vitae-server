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

module.exports = router;
