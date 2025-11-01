const Logger = require('../utils/logger');
const Response = require('../utils/response');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  Logger.error(`${req.method} ${req.url} - ${err.message}`);
  Logger.error(err.stack);
  
  // 区分不同类型的错误
  if (err.name === 'ValidationError') {
    return res.status(400).json(Response.error(err.message, 400));
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(Response.error('未授权访问', 401));
  }
  
  if (err.name === 'ForbiddenError') {
    return res.status(403).json(Response.error('无权限访问', 403));
  }
  
  // 默认服务器错误
  res.status(500).json(Response.error('服务器内部错误', 500));
};

module.exports = errorHandler;
