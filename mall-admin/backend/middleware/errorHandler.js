const Logger = require('../utils/logger');
const Response = require('../utils/response');

/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 记录错误日志
  Logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
  // 返回错误响应
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  return Response.error(res, message, statusCode);
};

/**
 * 404错误处理
 */
const notFoundHandler = (req, res) => {
  return Response.error(res, '请求的资源不存在', 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
