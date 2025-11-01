const JWTUtil = require('../utils/jwt');
const Response = require('../utils/response');

/**
 * 管理员认证中间件
 */
const authMiddleware = (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(Response.error('未提供认证令牌', 401));
    }
    
    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀
    
    // 验证token
    const decoded = JWTUtil.verify(token);
    
    // 将管理员信息添加到请求对象
    req.admin = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json(Response.error('认证失败，请重新登录', 401));
  }
};

module.exports = authMiddleware;
