const { query } = require('../config/database');

/**
 * 订单模型
 */
class Order {
  /**
   * 获取订单列表
   * @param {Object} params 
   * @returns {Promise<Array>}
   */
  static async list(params = {}) {
    const { page = 1, pageSize = 10, orderNo, status, startTime, endTime } = params;
    const offset = (page - 1) * pageSize;
    
    let sql = `
      SELECT o.*, u.nickname as user_nickname
      FROM \`order\` o
      LEFT JOIN user u ON o.user_id = u.id
      WHERE 1=1
    `;
    const sqlParams = [];

    if (orderNo) {
      sql += ' AND o.order_no LIKE ?';
      sqlParams.push(`%${orderNo}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND o.status = ?';
      sqlParams.push(status);
    }
    if (startTime) {
      sql += ' AND o.create_time >= ?';
      sqlParams.push(startTime);
    }
    if (endTime) {
      sql += ' AND o.create_time <= ?';
      sqlParams.push(endTime);
    }

    sql += ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
    sqlParams.push(pageSize, offset);

    return await query(sql, sqlParams);
  }

  /**
   * 获取订单总数
   * @param {Object} params 
   * @returns {Promise<number>}
   */
  static async count(params = {}) {
    const { orderNo, status, startTime, endTime } = params;
    
    let sql = 'SELECT COUNT(*) as total FROM `order` WHERE 1=1';
    const sqlParams = [];

    if (orderNo) {
      sql += ' AND order_no LIKE ?';
      sqlParams.push(`%${orderNo}%`);
    }
    if (status !== undefined && status !== '') {
      sql += ' AND status = ?';
      sqlParams.push(status);
    }
    if (startTime) {
      sql += ' AND create_time >= ?';
      sqlParams.push(startTime);
    }
    if (endTime) {
      sql += ' AND create_time <= ?';
      sqlParams.push(endTime);
    }

    const results = await query(sql, sqlParams);
    return results[0].total;
  }

  /**
   * 根据ID查找订单
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const sql = `
      SELECT o.*, u.nickname as user_nickname, u.avatar as user_avatar
      FROM \`order\` o
      LEFT JOIN user u ON o.user_id = u.id
      WHERE o.id = ? LIMIT 1
    `;
    const results = await query(sql, [id]);
    return results[0] || null;
  }

  /**
   * 获取订单商品
   * @param {number} orderId 
   * @returns {Promise<Array>}
   */
  static async getOrderItems(orderId) {
    const sql = 'SELECT * FROM order_item WHERE order_id = ?';
    return await query(sql, [orderId]);
  }

  /**
   * 更新订单状态
   * @param {number} id 
   * @param {number} status 
   * @returns {Promise<boolean>}
   */
  static async updateStatus(id, status) {
    const fields = ['status = ?'];
    const params = [status];

    // 根据状态更新相应的时间字段
    if (status === 1) {
      fields.push('pay_time = NOW()');
    } else if (status === 2) {
      fields.push('deliver_time = NOW()');
    } else if (status === 3) {
      fields.push('finish_time = NOW()');
    }

    params.push(id);
    const sql = `UPDATE \`order\` SET ${fields.join(', ')} WHERE id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  }

  /**
   * 获取统计数据
   * @returns {Promise<Object>}
   */
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as pending_payment,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as pending_delivery,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) as completed,
        SUM(total_amount) as total_amount
      FROM \`order\`
    `;
    const results = await query(sql);
    return results[0];
  }
}

module.exports = Order;
