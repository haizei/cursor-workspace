const BaseModel = require('./BaseModel');

class Goods extends BaseModel {
  constructor() {
    super('goods');
  }

  /**
   * 获取商品列表（带关联信息）
   */
  async getListWithCategory(page = 1, pageSize = 10, conditions = {}) {
    let sql = `
      SELECT g.*, c.name as category_name 
      FROM goods g 
      LEFT JOIN category c ON g.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (conditions.name) {
      sql += ` AND g.name LIKE ?`;
      params.push(`%${conditions.name}%`);
    }

    if (conditions.category_id) {
      sql += ` AND g.category_id = ?`;
      params.push(conditions.category_id);
    }

    if (conditions.status !== undefined) {
      sql += ` AND g.status = ?`;
      params.push(conditions.status);
    }

    sql += ` ORDER BY g.sort ASC, g.id DESC`;

    // 总数查询
    const countSql = sql.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as count FROM').replace(/ORDER BY.*/, '');
    const [countResult] = await this.query(countSql, params);
    const total = countResult.count;

    // 分页查询
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, (page - 1) * pageSize);

    const list = await this.query(sql, params);

    return {
      list,
      total,
      page,
      pageSize
    };
  }
}

module.exports = new Goods();
