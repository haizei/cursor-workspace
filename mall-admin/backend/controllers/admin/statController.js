const { query } = require('../../config/database');
const Order = require('../../models/Order');
const Response = require('../../utils/response');

/**
 * 数据统计控制器
 */
class StatController {
  /**
   * 获取仪表盘统计数据
   */
  static async dashboard(req, res, next) {
    try {
      // 订单统计
      const orderStats = await Order.getStats();

      // 用户统计
      const userCountSql = 'SELECT COUNT(*) as total FROM user';
      const userResults = await query(userCountSql);
      const userCount = userResults[0].total;

      // 今日新增用户
      const todayUserSql = `
        SELECT COUNT(*) as total FROM user 
        WHERE DATE(create_time) = CURDATE()
      `;
      const todayUserResults = await query(todayUserSql);
      const todayUserCount = todayUserResults[0].total;

      // 商品统计
      const goodsCountSql = 'SELECT COUNT(*) as total FROM goods';
      const goodsResults = await query(goodsCountSql);
      const goodsCount = goodsResults[0].total;

      // 今日订单统计
      const todayOrderSql = `
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(total_amount), 0) as amount
        FROM \`order\`
        WHERE DATE(create_time) = CURDATE()
      `;
      const todayOrderResults = await query(todayOrderSql);
      const todayOrder = todayOrderResults[0];

      // 本月订单统计
      const monthOrderSql = `
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(total_amount), 0) as amount
        FROM \`order\`
        WHERE YEAR(create_time) = YEAR(CURDATE())
          AND MONTH(create_time) = MONTH(CURDATE())
      `;
      const monthOrderResults = await query(monthOrderSql);
      const monthOrder = monthOrderResults[0];

      // 组装数据
      const data = {
        // 总体统计
        total: {
          orders: orderStats.total_orders,
          sales: parseFloat(orderStats.total_amount || 0),
          users: userCount,
          goods: goodsCount
        },
        // 订单状态统计
        orderStatus: {
          pendingPayment: orderStats.pending_payment,
          pendingDelivery: orderStats.pending_delivery,
          delivered: orderStats.delivered,
          completed: orderStats.completed
        },
        // 今日数据
        today: {
          orders: todayOrder.total,
          sales: parseFloat(todayOrder.amount),
          users: todayUserCount
        },
        // 本月数据
        month: {
          orders: monthOrder.total,
          sales: parseFloat(monthOrder.amount)
        }
      };

      res.json(Response.success(data));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = StatController;
