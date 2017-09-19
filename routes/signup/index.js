const express = require('express');
const router = express.Router();
const signUpDao = require('./dao');

router.post('/add', (req, res, next) => {
  signUpDao.add(req, res, next);
});
module.exports = router;
