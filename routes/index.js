const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {

  // res.render('index');
  res.send('Success');

});

module.exports = router;
