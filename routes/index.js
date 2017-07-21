const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {

  // res.render('index');
  res.send({status: 'success', user: req.user});

});

module.exports = router;
