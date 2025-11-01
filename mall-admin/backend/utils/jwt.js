const jwt = require('jsonwebtoken');
const config = require('../config');

class JWT {
  /**
   * 生成Token
   */
  static generate(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  /**
   * 验证Token
   */
  static verify(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      return null;
    }
  }

  /**
   * 解码Token（不验证）
   */
  static decode(token) {
    return jwt.decode(token);
  }
}

module.exports = JWT;
