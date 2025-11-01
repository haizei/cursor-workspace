const BaseModel = require('./BaseModel');

class Order extends BaseModel {
  constructor() {
    super('order');
  }

  /**
   * 获取订单列表（带用户信息）
   */
  async getListWithUser(page = 1, pageSize = 10, conditions = {}) {
    let sql = `
      SELECT o.*, u.nickname as user_nickname, u.avatar as user_avatar 
      FROM \`order\` o 
      LEFT JOIN user u ON o.user_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (conditions.order_no) {
      sql += ` AND o.order_no LIKE ?`;
      params.push(`%${conditions.order_no}%`);
    }

    if (conditions.status !== undefined) {
      sql += ` AND o.status = ?`;
      params.push(conditions.status);
    }

    if (conditions.start_time) {
      sql += ` AND o.create_time >= ?`;
      params.push(conditions.start_time);
    }

    if (conditions.end_time) {
      sql += ` AND o.create_time <= ?`;
      params.push(conditions.end_time);
    }

    sql += ` ORDER BY o.create_time DESC`;

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

  /**
   * 获取订单详情（包含订单商品）
   */
  async getDetailWithItems(orderId) {
    const order = await this.findById(orderId);
    if (!order) return null;

    const pool = require('../config/database');
    const [items] = await pool.execute(
      'SELECT * FROM order_item WHERE order_id = ?',
      [orderId]
    );

    return {
      ...order,
      items
    };
  }
}

module.exports = new Order();
