const { query } = require('../config/database');

/**
 * 商品模型
 */
class Goods {
  /**
   * 获取商品列表
   * @param {Object} params 查询参数
   * @returns {Promise<Array>}
   */
  static async list(params = {}) {
    const { page = 1, pageSize = 10, name, categoryId, status } = params;
    const offset = (page - 1) * pageSize;
    
    let sql = `
      SELECT g.*, c.name as category_name
      FROM goods g
      LEFT JOIN category c ON g.category_id = c.id
      WHERE 1=1
    `;
    const sqlParams = [];

    if (name) {
      sql += ' AND g.name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (categoryId) {
      sql += ' AND g.category_id = ?';
      sqlParams.push(categoryId);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND g.status = ?';
      sqlParams.push(status);
    }

    sql += ' ORDER BY g.sort ASC, g.id DESC LIMIT ? OFFSET ?';
    sqlParams.push(pageSize, offset);

    return await query(sql, sqlParams);
  }

  /**
   * 获取商品总数
   * @param {Object} params 查询参数
   * @returns {Promise<number>}
   */
  static async count(params = {}) {
    const { name, categoryId, status } = params;
    
    let sql = 'SELECT COUNT(*) as total FROM goods WHERE 1=1';
    const sqlParams = [];

    if (name) {
      sql += ' AND name LIKE ?';
      sqlParams.push(`%${name}%`);
    }
    if (categoryId) {
      sql += ' AND category_id = ?';
      sqlParams.push(categoryId);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }

    const results = await query(sql, sqlParams);
    return results[0].total;
  }

  /**
   * 根据ID查找商品
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = 'SELECT * FROM goods WHERE id = ? LIMIT 1';
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 创建商品
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  static async create(data) {
    const sql = `
      INSERT INTO goods (
        name, main_image, images, price, stock, category_id,
        description, detail, sort, status, is_recommend, recommend_sort
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.name,
      data.main_image || null,
      data.images ? JSON.stringify(data.images) : null,
      data.price,
      data.stock || 0,
      data.category_id,
      data.description || null,
      data.detail || null,
      data.sort || 0,
      data.status || 1,
      data.is_recommend || 0,
      data.recommend_sort || 0
    ];
    const result = await query(sql, params);
    return { id: result.insertId, ...data };
  }

  /**
   * 更新商品
   * @param {number} id 
   * @param {Object} data 
   * @returns {Promise<boolean>}
   */
  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowedFields = [
      'name', 'main_image', 'images', 'price', 'stock', 'category_id',
      'description', 'detail', 'sort', 'status', 'is_recommend', 'recommend_sort'
    ];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(field === 'images' && typeof data[field] === 'object' 
          ? JSON.stringify(data[field]) 
          : data[field]);
      }
    });

    if (fields.length === 0) {
      return false;
    }

    params.push(id);
    const sql = `UPDATE goods SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * 删除商品
   * @param {number} id 
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const sql = 'DELETE FROM goods WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  /**
   * 批量删除商品
   * @param {Array} ids 
   * @returns {Promise<boolean>}
   */
  static async batchDelete(ids) {
    const sql = `DELETE FROM goods WHERE id IN (${ids.map(() => '?').join(',')})`;
    const result = await query(sql, ids);
    return result.affectedRows > 0;
  }

  /**
   * 更新商品状态
   * @param {number} id 
   * @param {number} status 
   * @returns {Promise<boolean>}
   */
  static async updateStatus(id, status) {
    const sql = 'UPDATE goods SET status = ? WHERE id = ?';
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }
}

module.exports = Goods;
