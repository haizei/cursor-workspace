const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { success, error } = require('../utils/response');

// 确保上传目录存在
const uploadDir = config.upload.path;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = req.query.type || 'common';
    const uploadPath = path.join(uploadDir, type);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(config.upload.maxFileSize)
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  }
});

/**
 * 上传图片
 */
async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json(error('请选择要上传的文件', 400));
    }

    const type = req.query.type || 'common';
    const filePath = `/uploads/${type}/${req.file.filename}`;

    res.json(success({
      url: filePath,
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    }, '上传成功'));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upload,
  uploadImage
};
