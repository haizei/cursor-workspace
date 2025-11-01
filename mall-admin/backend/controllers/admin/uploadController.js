const Response = require('../../utils/response');
const path = require('path');

/**
 * 文件上传控制器
 */
class UploadController {
  /**
   * 上传图片
   */
  static async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.json(Response.error('请选择要上传的文件', 400));
      }

      // 返回文件访问路径
      const filePath = `/uploads/${req.body.type || 'goods'}/${req.file.filename}`;

      res.json(Response.success({
        url: filePath,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }, '上传成功'));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 上传多张图片
   */
  static async uploadImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.json(Response.error('请选择要上传的文件', 400));
      }

      const files = req.files.map(file => ({
        url: `/uploads/${req.body.type || 'goods'}/${file.filename}`,
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
      }));

      res.json(Response.success(files, '上传成功'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadController;
