/**
 * 验证工具类
 */
class Validator {
  /**
   * 验证必填字段
   * @param {Object} data 数据对象
   * @param {Array} fields 必填字段数组
   * @returns {Object} { valid: boolean, message: string }
   */
  static required(data, fields) {
    for (const field of fields) {
      if (!data[field] && data[field] !== 0 && data[field] !== false) {
        return {
          valid: false,
          message: `${field} 不能为空`
        };
      }
    }
    return { valid: true };
  }

  /**
   * 验证手机号
   * @param {string} phone 
   * @returns {boolean}
   */
  static isPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  }

  /**
   * 验证邮箱
   * @param {string} email 
   * @returns {boolean}
   */
  static isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * 验证价格
   * @param {number} price 
   * @returns {boolean}
   */
  static isPrice(price) {
    return /^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) >= 0;
  }

  /**
   * 验证整数
   * @param {*} value 
   * @returns {boolean}
   */
  static isInteger(value) {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
  }
}

module.exports = Validator;
