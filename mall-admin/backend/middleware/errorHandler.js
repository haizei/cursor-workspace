const Response = require('../utils/response');

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Multer文件上传错误
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(Response.error('文件大小超出限制', 400));
  }

  // 数据库错误
  if (err.code?.startsWith('ER_')) {
    return res.status(500).json(Response.error('数据库操作失败', 500));
  }

  // 默认错误
  const status = err.status || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(status).json(Response.error(message, status));
};

module.exports = errorHandler;
