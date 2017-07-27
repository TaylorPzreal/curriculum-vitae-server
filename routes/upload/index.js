const express = require('express');
const router = express.Router();

// 上传图片路径，存储到前端项目根目录下面的相关文件夹，如果不存在需要创建，否则报错。
const uploadPath = '../curriculum-vitae/upload/images/';
const multer = require('multer');
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, uploadPath);
  },
  filename (req, file, cb) {
    const post = file.originalname.match(/\.(png|jpeg|gif|bmp|tiff|svg|jpg)$/g)[0];
    cb(null, `honeymorning-${Date.now()}${post}`);
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
