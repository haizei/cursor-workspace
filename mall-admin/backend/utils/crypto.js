const bcrypt = require('bcrypt');

class Crypto {
  /**
   * 加密密码
   */
  static async hash(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * 验证密码
   */
  static async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = Crypto;
