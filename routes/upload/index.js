const express = require('express');
const router = express.Router();

const uploadPath = '../curriculum-vitae/upload/images/';
const multer = require('multer');
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, uploadPath);
  },
  filename (req, file, cb) {
    const post = file.originalname.match(/\.(png|jpeg|gif|bmp|tiff|svg|jpg)$/g)[0];
    cb(null, `${file.fieldname}-${Date.now()}${post}`);
  }
});
const upload = multer({
  dest: uploadPath,
  limits:  {
    fileSize: 512000
  },
  storage
});

// 上传图片
router.post('/image', upload.single('image'), (req, res) => {
  res.json({
    code: 2000,
    data: req.file.path.replace(/..\/curriculum-vitae/, ''),
    msg: 'Success'
  });
});

module.exports = router;
