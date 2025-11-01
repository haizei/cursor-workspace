const JwtUtil = require('../utils/jwt');
const Response = require('../utils/response');

/**
 * 管理员认证中间件
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json(Response.error('未提供认证令牌', 401));
    }

    // 验证token
    const decoded = JwtUtil.verify(token);
    
    // 将管理员信息附加到请求对象
    req.admin = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json(Response.error('认证失败：' + error.message, 401));
  }
};

module.exports = authMiddleware;
