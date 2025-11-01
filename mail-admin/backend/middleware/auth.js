const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/response');

/**
 * 管理员认证中间件
 */
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;

  if (!token) {
    return res.status(401).json(error('未登录', 401));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json(error('Token无效或已过期', 401));
  }

  req.admin = decoded;
  next();
}

module.exports = authMiddleware;
