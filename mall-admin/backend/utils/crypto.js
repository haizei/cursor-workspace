const bcrypt = require('bcrypt');

/**
 * 加密工具类
 */
class CryptoUtil {
  /**
   * 加密密码
   * @param {string} password 明文密码
   * @returns {Promise<string>} 加密后的密码
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 验证密码
   * @param {string} password 明文密码
   * @param {string} hash 加密后的密码
   * @returns {Promise<boolean>} 是否匹配
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = CryptoUtil;
