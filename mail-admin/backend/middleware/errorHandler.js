/**
 * 错误处理中间件
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    data: null
  });
}

module.exports = errorHandler;
