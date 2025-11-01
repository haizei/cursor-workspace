const { query } = require('../config/database');

/**
 * 用户模型
 */
class User {
  /**
   * 获取用户列表
   * @param {Object} params 
   * @returns {Promise<Array>}
   */
  static async list(params = {}) {
    const { page = 1, pageSize = 10, nickname, phone, status } = params;
    const offset = (page - 1) * pageSize;
    
    let sql = 'SELECT * FROM user WHERE 1=1';
    const sqlParams = [];

    if (nickname) {
      sql += ' AND nickname LIKE ?';
      sqlParams.push(`%${nickname}%`);
    }
    if (phone) {
      sql += ' AND phone LIKE ?';
      sqlParams.push(`%${phone}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    sqlParams.push(pageSize, offset);

    return await query(sql, sqlParams);
  }

  /**
   * 获取用户总数
   * @param {Object} params 
   * @returns {Promise<number>}
   */
  static async count(params = {}) {
    const { nickname, phone, status } = params;
    
    let sql = 'SELECT COUNT(*) as total FROM user WHERE 1=1';
    const sqlParams = [];

    if (nickname) {
      sql += ' AND nickname LIKE ?';
      sqlParams.push(`%${nickname}%`);
    }
    if (phone) {
      sql += ' AND phone LIKE ?';
      sqlParams.push(`%${phone}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }

    const results = await query(sql, sqlParams);
    return results[0].total;
  }

  /**
   * 根据ID查找用户
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = 'SELECT * FROM user WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 更新用户状态
   * @param {number} id 
   * @param {number} status 
   * @returns {Promise<boolean>}
   */
  static async updateStatus(id, status) {
    const sql = 'UPDATE user SET status = ? WHERE id = ?';
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  /**
   * 获取用户详情（包含订单和地址数量）
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async getDetail(id) {
    const userSql = 'SELECT * FROM user WHERE id = ? LIMIT 1';
    const users = await query(userSql, [id]);
    
    if (!users[0]) {
      return null;
    }

    const user = users[0];

    // 获取订单数
    const orderSql = 'SELECT COUNT(*) as total FROM `order` WHERE user_id = ?';
    const orderResults = await query(orderSql, [id]);
    user.order_count = orderResults[0].total;

    // 获取地址数
    const addressSql = 'SELECT COUNT(*) as total FROM address WHERE user_id = ?';
    const addressResults = await query(addressSql, [id]);
    user.address_count = addressResults[0].total;

    return user;
  }
}

module.exports = User;
