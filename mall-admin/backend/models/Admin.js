const { query } = require('../config/database');

/**
 * 管理员模型
 */
class Admin {
  /**
   * 根据用户名查找管理员
   * @param {string} username 
   * @returns {Promise<Object|null>}
   */
  static async findByUsername(username) {
    const sql = 'SELECT * FROM admin WHERE username = ? LIMIT 1';
    const results = await query(sql, [username]);
    return results[0] || null;
  }

  /**
   * 根据ID查找管理员
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = 'SELECT * FROM admin WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 创建管理员
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const sql = `
      INSERT INTO admin (username, password, nickname, avatar, permissions, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.username,
      data.password,
      data.nickname || null,
      data.avatar || null,
      data.permissions ? JSON.stringify(data.permissions) : null,
      data.status || 1
    ];
    const result = await query(sql, params);
    return { id: result.insertId, ...data };
  }

  /**
   * 更新管理员信息
   * @param {number} id 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  static async update(id, data) {
    const fields = [];
    const params = [];

    if (data.password) {
      fields.push('password = ?');
      params.push(data.password);
    }
    if (data.nickname !== undefined) {
      fields.push('nickname = ?');
      params.push(data.nickname);
    }
    if (data.avatar !== undefined) {
      fields.push('avatar = ?');
      params.push(data.avatar);
    }
    if (data.permissions !== undefined) {
      fields.push('permissions = ?');
      params.push(JSON.stringify(data.permissions));
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      params.push(data.status);
    }

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE admin SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * 更新最后登录信息
   * @param {number} id 
   * @param {string} ip 
   * @returns {Promise<boolean>}
   */
  static async updateLastLogin(id, ip) {
    const sql = `
      UPDATE admin 
      SET last_login_time = NOW(), last_login_ip = ? 
      WHERE id = ?
    `;
    const result = await query(sql, [ip, id]);
    return result.affectedRows > 0;
  }

  /**
   * 获取管理员列表
   * @param {number} page 
   * @param {number} pageSize 
   * @returns {Promise<Array>}
   */
  static async list(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const sql = `
      SELECT id, username, nickname, avatar, status, 
             last_login_time, last_login_ip, create_time 
      FROM admin 
      ORDER BY id DESC 
      LIMIT ? OFFSET ?
    `;
    return await query(sql, [pageSize, offset]);
  }

  /**
   * 获取管理员总数
   * @returns {Promise<number>}
   */
  static async count() {
    const sql = 'SELECT COUNT(*) as total FROM admin';
    const results = await query(sql);
    return results[0].total;
  }
}

module.exports = Admin;
