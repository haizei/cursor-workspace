const db = require('../../config/database');
const Response = require('../../utils/response');

class OrderController {
  /**
   * 获取订单列表
   */
  static async list(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        orderNo, 
        status, 
        startDate, 
        endDate 
      } = req.query;
      const offset = (page - 1) * pageSize;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (orderNo) {
        whereClause += ' AND o.order_no LIKE ?';
        params.push(`%${orderNo}%`);
      }
      
      if (status !== undefined && status !== '') {
        whereClause += ' AND o.status = ?';
        params.push(status);
      }
      
      if (startDate) {
        whereClause += ' AND o.create_time >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        whereClause += ' AND o.create_time <= ?';
        params.push(endDate + ' 23:59:59');
      }
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM \`order\` o ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [orders] = await db.query(
        `SELECT o.*, u.nickname as user_nickname
         FROM \`order\` o
         LEFT JOIN user u ON o.user_id = u.id
         ${whereClause}
         ORDER BY o.id DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      return Response.page(res, orders, total, page, pageSize);
      
    } catch (error) {
      console.error('获取订单列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取订单详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      // 查询订单基本信息
      const [orders] = await db.query(
        `SELECT o.*, u.nickname as user_nickname, u.avatar as user_avatar
         FROM \`order\` o
         LEFT JOIN user u ON o.user_id = u.id
         WHERE o.id = ?`,
        [id]
      );
      
      if (orders.length === 0) {
        return Response.error(res, '订单不存在', 404);
      }
      
      const order = orders[0];
      
      // 查询订单商品
      const [items] = await db.query(
        `SELECT oi.*, g.main_image as current_goods_image
         FROM order_item oi
         LEFT JOIN goods g ON oi.goods_id = g.id
         WHERE oi.order_id = ?`,
        [id]
      );
      
      order.items = items;
      
      return Response.success(res, order);
      
    } catch (error) {
      console.error('获取订单详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 发货
   */
  static async deliver(req, res) {
    try {
      const { id } = req.body;
      
      // 检查订单状态
      const [orders] = await db.query(
        'SELECT * FROM `order` WHERE id = ?',
        [id]
      );
      
      if (orders.length === 0) {
        return Response.error(res, '订单不存在', 404);
      }
      
      if (orders[0].status !== 1) {
        return Response.error(res, '只能发货待发货的订单', 400);
      }
      
      // 更新订单状态为已发货
      await db.query(
        'UPDATE `order` SET status = 2, deliver_time = NOW() WHERE id = ?',
        [id]
      );
      
      return Response.success(res, null, '发货成功');
      
    } catch (error) {
      console.error('订单发货错误:', error);
      return Response.error(res, '发货失败', 500);
    }
  }
  
  /**
   * 关闭/取消订单
   */
  static async close(req, res) {
    try {
      const { id } = req.body;
      
      // 检查订单状态
      const [orders] = await db.query(
        'SELECT * FROM `order` WHERE id = ?',
        [id]
      );
      
      if (orders.length === 0) {
        return Response.error(res, '订单不存在', 404);
      }
      
      if (orders[0].status >= 3) {
        return Response.error(res, '该订单无法关闭', 400);
      }
      
      // 更新订单状态为已关闭
      await db.query(
        'UPDATE `order` SET status = 4 WHERE id = ?',
        [id]
      );
      
      return Response.success(res, null, '订单已关闭');
      
    } catch (error) {
      console.error('关闭订单错误:', error);
      return Response.error(res, '关闭失败', 500);
    }
  }
  
  /**
   * 导出订单（返回订单数据，前端处理导出）
   */
  static async export(req, res) {
    try {
      const { status, startDate, endDate } = req.query;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (status !== undefined && status !== '') {
        whereClause += ' AND o.status = ?';
        params.push(status);
      }
      
      if (startDate) {
        whereClause += ' AND o.create_time >= ?';
        params.push(startDate);
      }
      
      if (endDate) {
        whereClause += ' AND o.create_time <= ?';
        params.push(endDate + ' 23:59:59');
      }
      
      const [orders] = await db.query(
        `SELECT o.*, u.nickname as user_nickname
         FROM \`order\` o
         LEFT JOIN user u ON o.user_id = u.id
         ${whereClause}
         ORDER BY o.id DESC
         LIMIT 10000`,
        params
      );
      
      return Response.success(res, orders);
      
    } catch (error) {
      console.error('导出订单错误:', error);
      return Response.error(res, '导出失败', 500);
    }
  }
}

module.exports = OrderController;
