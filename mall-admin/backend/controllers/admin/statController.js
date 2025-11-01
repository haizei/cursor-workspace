const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 数据统计控制器
 */
class StatController {
  /**
   * 获取仪表盘统计数据
   */
  static async getDashboard(req, res) {
    try {
      // 订单总数
      const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM `order`');
      
      // 销售额总计
      const [[{ totalSales }]] = await db.query(
        'SELECT SUM(total_amount) as totalSales FROM `order` WHERE status IN (2, 3)'
      );
      
      // 用户总数
      const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM user');
      
      // 商品总数
      const [[{ totalGoods }]] = await db.query('SELECT COUNT(*) as totalGoods FROM goods');
      
      // 今日新增用户
      const [[{ todayUsers }]] = await db.query(
        'SELECT COUNT(*) as todayUsers FROM user WHERE DATE(create_time) = CURDATE()'
      );
      
      // 今日订单数
      const [[{ todayOrders }]] = await db.query(
        'SELECT COUNT(*) as todayOrders FROM `order` WHERE DATE(create_time) = CURDATE()'
      );
      
      // 今日销售额
      const [[{ todaySales }]] = await db.query(
        'SELECT SUM(total_amount) as todaySales FROM `order` WHERE DATE(create_time) = CURDATE() AND status IN (2, 3)'
      );
      
      // 本月新增用户
      const [[{ monthUsers }]] = await db.query(
        'SELECT COUNT(*) as monthUsers FROM user WHERE YEAR(create_time) = YEAR(NOW()) AND MONTH(create_time) = MONTH(NOW())'
      );
      
      // 本月订单数
      const [[{ monthOrders }]] = await db.query(
        'SELECT COUNT(*) as monthOrders FROM `order` WHERE YEAR(create_time) = YEAR(NOW()) AND MONTH(create_time) = MONTH(NOW())'
      );
      
      // 本月销售额
      const [[{ monthSales }]] = await db.query(
        'SELECT SUM(total_amount) as monthSales FROM `order` WHERE YEAR(create_time) = YEAR(NOW()) AND MONTH(create_time) = MONTH(NOW()) AND status IN (2, 3)'
      );
      
      // 待发货订单数
      const [[{ pendingOrders }]] = await db.query(
        'SELECT COUNT(*) as pendingOrders FROM `order` WHERE status = 1'
      );
      
      // 最近7天销售趋势
      const [salesTrend] = await db.query(`
        SELECT DATE(create_time) as date, COUNT(*) as orders, SUM(total_amount) as sales
        FROM \`order\`
        WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(create_time)
        ORDER BY date ASC
      `);
      
      const data = {
        overview: {
          totalOrders,
          totalSales: totalSales || 0,
          totalUsers,
          totalGoods
        },
        today: {
          users: todayUsers,
          orders: todayOrders,
          sales: todaySales || 0
        },
        month: {
          users: monthUsers,
          orders: monthOrders,
          sales: monthSales || 0
        },
        pending: {
          orders: pendingOrders
        },
        salesTrend
      };
      
      res.json(Response.success(data));
      
    } catch (error) {
      Logger.error(`获取统计数据失败: ${error.message}`);
      res.json(Response.error('获取统计数据失败'));
    }
  }
}

module.exports = StatController;
