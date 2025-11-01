const Response = require('../utils/response');
const Logger = require('../utils/logger');

/**
 * 文件上传控制器
 */
class UploadController {
  /**
   * 上传图片
   */
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.json(Response.error('请选择要上传的文件'));
      }
      
      // 构建访问URL
      const url = `/uploads/${req.file.filename}`;
      
      Logger.info(`文件上传成功: ${req.file.originalname} -> ${url}`);
      
      res.json(Response.success({
        url,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }, '上传成功'));
      
    } catch (error) {
      Logger.error(`文件上传失败: ${error.message}`);
      res.json(Response.error('文件上传失败'));
    }
  }
}

module.exports = UploadController;
