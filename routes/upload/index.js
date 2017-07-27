const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uoloads/'});

router.post('/image', upload.single('image'), (req, res, next) => {
  console.warn(req.body);
  console.warn(req.query);
  console.warn(req.params);
  console.warn('upload image success');
  res.json('Upload Image Success');
});

module.exports = router;
