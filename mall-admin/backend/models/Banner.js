const { query } = require('../config/database');

/**
 * 轮播图模型
 */
class Banner {
  /**
   * 获取轮播图列表
   * @param {Object} params 
   * @returns {Promise<Array>}
   */
  static async list(params = {}) {
    const { page, pageSize, name, status } = params;
    
    let sql = 'SELECT * FROM banner WHERE 1=1';
    const sqlParams = [];

    if (name) {
      sql += ' AND name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }

    sql += ' ORDER BY sort ASC, id DESC';

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      sql += ' LIMIT ? OFFSET ?';
      sqlParams.push(pageSize, offset);
    }

    return await query(sql, sqlParams);
  }

  /**
   * 获取轮播图总数
   * @param {Object} params 
   * @returns {Promise<number>}
   */
  static async count(params = {}) {
    const { name, status } = params;
    
    let sql = 'SELECT COUNT(*) as total FROM banner WHERE 1=1';
    const sqlParams = [];

    if (name) {
      sql += ' AND name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }

    const results = await query(sql, sqlParams);
    return results[0].total;
  }

  /**
   * 根据ID查找轮播图
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = 'SELECT * FROM banner WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 创建轮播图
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const sql = `
      INSERT INTO banner (name, image, link, link_type, sort, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name || null,
      data.image,
      data.link || null,
      data.link_type || 1,
      data.sort || 0,
      data.status || 1
    ];
    const result = await query(sql, params);
    return { id: result.insertId, ...data };
  }

  /**
   * 更新轮播图
   * @param {number} id 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowedFields = ['name', 'image', 'link', 'link_type', 'sort', 'status'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE banner SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * 删除轮播图
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM banner WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Banner;
