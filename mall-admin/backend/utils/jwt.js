const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * JWT工具类
 */
class JWTUtil {
  /**
   * 生成Token
   * @param {Object} payload - 载荷数据
   * @returns {string} token
   */
  static sign(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  /**
   * 验证Token
   * @param {string} token - JWT token
   * @returns {Object} 解码后的数据
   */
  static verify(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Token验证失败');
    }
  }

  /**
   * 解码Token（不验证）
   * @param {string} token - JWT token
   * @returns {Object} 解码后的数据
   */
  static decode(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTUtil;
