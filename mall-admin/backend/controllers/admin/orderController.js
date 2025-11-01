const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 订单管理控制器
 */
class OrderController {
  /**
   * 获取订单列表
   */
  static async getList(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        orderNo = '', 
        status = '',
        startTime = '',
        endTime = ''
      } = req.query;
      
      const offset = (page - 1) * pageSize;
      
      let sql = `
        SELECT o.*, u.nickname as user_nickname 
        FROM \`order\` o 
        LEFT JOIN user u ON o.user_id = u.id 
        WHERE 1=1
      `;
      let countSql = 'SELECT COUNT(*) as total FROM `order` WHERE 1=1';
      const params = [];
      const countParams = [];
      
      if (orderNo) {
        sql += ' AND o.order_no LIKE ?';
        countSql += ' AND order_no LIKE ?';
        params.push(`%${orderNo}%`);
        countParams.push(`%${orderNo}%`);
      }
      
      if (status !== '') {
        sql += ' AND o.status = ?';
        countSql += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }
      
      if (startTime) {
        sql += ' AND o.create_time >= ?';
        countSql += ' AND create_time >= ?';
        params.push(startTime);
        countParams.push(startTime);
      }
      
      if (endTime) {
        sql += ' AND o.create_time <= ?';
        countSql += ' AND create_time <= ?';
        params.push(endTime);
        countParams.push(endTime);
      }
      
      sql += ' ORDER BY o.id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, countParams);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取订单列表失败: ${error.message}`);
      res.json(Response.error('获取订单列表失败'));
    }
  }
  
  /**
   * 获取订单详情
   */
  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      
      // 获取订单基本信息
      const [orders] = await db.query(`
        SELECT o.*, u.nickname as user_nickname, u.avatar as user_avatar 
        FROM \`order\` o 
        LEFT JOIN user u ON o.user_id = u.id 
        WHERE o.id = ?
      `, [id]);
      
      if (orders.length === 0) {
        return res.json(Response.error('订单不存在'));
      }
      
      const order = orders[0];
      
      // 获取订单商品列表
      const [items] = await db.query(
        'SELECT * FROM order_item WHERE order_id = ?',
        [id]
      );
      
      order.items = items;
      
      res.json(Response.success(order));
      
    } catch (error) {
      Logger.error(`获取订单详情失败: ${error.message}`);
      res.json(Response.error('获取订单详情失败'));
    }
  }
  
  /**
   * 订单发货
   */
  static async deliver(req, res) {
    try {
      const { id } = req.body;
      
      await db.query(
        'UPDATE `order` SET status = 2, deliver_time = NOW() WHERE id = ? AND status = 1',
        [id]
      );
      
      Logger.info(`订单发货成功 (ID: ${id})`);
      res.json(Response.success(null, '发货成功'));
      
    } catch (error) {
      Logger.error(`订单发货失败: ${error.message}`);
      res.json(Response.error('订单发货失败'));
    }
  }
  
  /**
   * 关闭/取消订单
   */
  static async close(req, res) {
    try {
      const { id } = req.body;
      
      await db.query(
        'UPDATE `order` SET status = 4 WHERE id = ?',
        [id]
      );
      
      Logger.info(`关闭订单成功 (ID: ${id})`);
      res.json(Response.success(null, '关闭订单成功'));
      
    } catch (error) {
      Logger.error(`关闭订单失败: ${error.message}`);
      res.json(Response.error('关闭订单失败'));
    }
  }
}

module.exports = OrderController;
