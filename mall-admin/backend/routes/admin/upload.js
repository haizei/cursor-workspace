const express = require('express');
const router = express.Router();
const UploadController = require('../../controllers/uploadController');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/upload');

// 所有路由需要认证
router.use(authMiddleware);

// 单文件上传
router.post('/image', upload.single('file'), UploadController.uploadImage);

// 多文件上传
router.post('/images', upload.array('files', 10), UploadController.uploadImages);

module.exports = router;
