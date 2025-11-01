const { query } = require('../config/database');

/**
 * 分类模型
 */
class Category {
  /**
   * 获取分类列表
   * @param {Object} params 
   * @returns {Promise<Array>}
   */
  static async list(params = {}) {
    const { page, pageSize, name, parentId } = params;
    
    let sql = 'SELECT * FROM category WHERE 1=1';
    const sqlParams = [];

    if (name) {
      sql += ' AND name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (parentId !== undefined) {
      sql += ' AND parent_id = ?';
      sqlParams.push(parentId);
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
   * 获取分类总数
   * @param {Object} params 
   * @returns {Promise<number>}
   */
  static async count(params = {}) {
    const { name, parentId } = params;
    
    let sql = 'SELECT COUNT(*) as total FROM category WHERE 1=1';
    const sqlParams = [];

    if (name) {
      sql += ' AND name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (parentId !== undefined) {
      sql += ' AND parent_id = ?';
      sqlParams.push(parentId);
    }

    const results = await query(sql, sqlParams);
    return results[0].total;
  }

  /**
   * 根据ID查找分类
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = 'SELECT * FROM category WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 创建分类
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const sql = `
      INSERT INTO category (name, image, parent_id, sort, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      data.name,
      data.image || null,
      data.parent_id || 0,
      data.sort || 0,
      data.status || 1
    ];
    const result = await query(sql, params);
    return { id: result.insertId, ...data };
  }

  /**
   * 更新分类
   * @param {number} id 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowedFields = ['name', 'image', 'parent_id', 'sort', 'status'];

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
    const sql = `UPDATE category SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * 删除分类
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM category WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 获取分类下的商品数量
   * @param {number} categoryId 
   * @returns {Promise<number>}
   */
  static async getGoodsCount(categoryId) {
    const sql = 'SELECT COUNT(*) as total FROM goods WHERE category_id = ?';
    const results = await query(sql, [categoryId]);
    return results[0].total;
  }
}

module.exports = Category;
