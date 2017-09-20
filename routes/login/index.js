const express = require('express');
const router = express.Router();
const Dao = require('./dao');

router.post('/local', (req, res, next) => {
  Dao.login(req, res, next);
});
module.exports = router;
