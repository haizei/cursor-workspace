const Response = require('../utils/response');

class UploadController {
  /**
   * 上传图片
   */
  static uploadImage(req, res) {
    try {
      if (!req.file) {
        return Response.error(res, '请选择要上传的文件', 400);
      }
      
      // 返回文件访问URL
      const fileUrl = `/uploads/${req.file.filename}`;
      
      // 如果有子目录
      const pathParts = req.file.path.split('/uploads/');
      if (pathParts.length > 1) {
        const relativePath = pathParts[1].replace(/\\/g, '/');
        const fullUrl = `/uploads/${relativePath}`;
        
        return Response.success(res, {
          url: fullUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size
        }, '上传成功');
      }
      
      return Response.success(res, {
        url: fileUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }, '上传成功');
      
    } catch (error) {
      console.error('上传文件错误:', error);
      return Response.error(res, '上传失败', 500);
    }
  }
  
  /**
   * 上传多张图片
   */
  static uploadImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return Response.error(res, '请选择要上传的文件', 400);
      }
      
      const files = req.files.map(file => {
        const pathParts = file.path.split('/uploads/');
        let url = `/uploads/${file.filename}`;
        
        if (pathParts.length > 1) {
          const relativePath = pathParts[1].replace(/\\/g, '/');
          url = `/uploads/${relativePath}`;
        }
        
        return {
          url,
          filename: file.filename,
          originalname: file.originalname,
          size: file.size
        };
      });
      
      return Response.success(res, files, '上传成功');
      
    } catch (error) {
      console.error('上传文件错误:', error);
      return Response.error(res, '上传失败', 500);
    }
  }
}

module.exports = UploadController;
