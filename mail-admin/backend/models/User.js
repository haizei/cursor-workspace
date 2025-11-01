const BaseModel = require('./BaseModel');

class User extends BaseModel {
  constructor() {
    super('user');
  }

  /**
   * 获取用户列表
   */
  async getList(page = 1, pageSize = 10, conditions = {}) {
    let sql = `SELECT * FROM user WHERE 1=1`;
    const params = [];

    if (conditions.nickname) {
      sql += ` AND nickname LIKE ?`;
      params.push(`%${conditions.nickname}%`);
    }

    if (conditions.phone) {
      sql += ` AND phone LIKE ?`;
      params.push(`%${conditions.phone}%`);
    }

    if (conditions.status !== undefined) {
      sql += ` AND status = ?`;
      params.push(conditions.status);
    }

    sql += ` ORDER BY create_time DESC`;

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

module.exports = new User();
