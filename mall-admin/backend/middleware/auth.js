const JWT = require('../utils/jwt');
const Response = require('../utils/response');

/**
 * 管理员认证中间件
 */
const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.unauthorized(res, '请提供有效的认证令牌');
    }
    
    const token = authHeader.substring(7);
    
    // 验证token
    const decoded = JWT.verify(token);
    
    if (!decoded) {
      return Response.unauthorized(res, '认证令牌无效或已过期');
    }
    
    // 将用户信息添加到请求对象
    req.admin = decoded;
    next();
  } catch (error) {
    return Response.unauthorized(res, '认证失败');
  }
};

module.exports = authMiddleware;
