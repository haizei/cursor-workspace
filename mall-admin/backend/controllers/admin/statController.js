const db = require('../../config/database');
const Response = require('../../utils/response');

class StatController {
  /**
   * 获取仪表盘统计数据
   */
  static async dashboard(req, res) {
    try {
      // 查询订单总数和总销售额
      const [orderStats] = await db.query(
        `SELECT 
         COUNT(*) as total_orders,
         COALESCE(SUM(CASE WHEN status >= 1 THEN total_amount ELSE 0 END), 0) as total_sales
         FROM \`order\``
      );
      
      // 查询用户总数
      const [userStats] = await db.query(
        'SELECT COUNT(*) as total_users FROM user'
      );
      
      // 查询商品总数
      const [goodsStats] = await db.query(
        'SELECT COUNT(*) as total_goods FROM goods WHERE status = 1'
      );
      
      // 查询今日新增用户
      const [todayUsers] = await db.query(
        `SELECT COUNT(*) as today_users 
         FROM user 
         WHERE DATE(create_time) = CURDATE()`
      );
      
      // 查询今日订单和销售额
      const [todayOrders] = await db.query(
        `SELECT 
         COUNT(*) as today_orders,
         COALESCE(SUM(CASE WHEN status >= 1 THEN total_amount ELSE 0 END), 0) as today_sales
         FROM \`order\`
         WHERE DATE(create_time) = CURDATE()`
      );
      
      // 查询本月订单和销售额
      const [monthOrders] = await db.query(
        `SELECT 
         COUNT(*) as month_orders,
         COALESCE(SUM(CASE WHEN status >= 1 THEN total_amount ELSE 0 END), 0) as month_sales
         FROM \`order\`
         WHERE YEAR(create_time) = YEAR(NOW()) AND MONTH(create_time) = MONTH(NOW())`
      );
      
      // 查询各状态订单数量
      const [orderStatusStats] = await db.query(
        `SELECT 
         status,
         COUNT(*) as count
         FROM \`order\`
         GROUP BY status`
      );
      
      // 查询最近7天销售趋势
      const [salesTrend] = await db.query(
        `SELECT 
         DATE(create_time) as date,
         COUNT(*) as orders,
         COALESCE(SUM(CASE WHEN status >= 1 THEN total_amount ELSE 0 END), 0) as sales
         FROM \`order\`
         WHERE create_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DATE(create_time)
         ORDER BY date ASC`
      );
      
      // 查询热销商品Top10
      const [hotGoods] = await db.query(
        `SELECT 
         g.id, g.name, g.main_image, g.price, g.sales,
         COALESCE(SUM(oi.count), 0) as order_count
         FROM goods g
         LEFT JOIN order_item oi ON g.id = oi.goods_id
         GROUP BY g.id
         ORDER BY order_count DESC
         LIMIT 10`
      );
      
      const data = {
        // 总览数据
        overview: {
          totalOrders: orderStats[0].total_orders,
          totalSales: parseFloat(orderStats[0].total_sales),
          totalUsers: userStats[0].total_users,
          totalGoods: goodsStats[0].total_goods
        },
        
        // 今日数据
        today: {
          users: todayUsers[0].today_users,
          orders: todayOrders[0].today_orders,
          sales: parseFloat(todayOrders[0].today_sales)
        },
        
        // 本月数据
        month: {
          orders: monthOrders[0].month_orders,
          sales: parseFloat(monthOrders[0].month_sales)
        },
        
        // 订单状态统计
        orderStatus: orderStatusStats,
        
        // 销售趋势
        salesTrend: salesTrend.map(item => ({
          date: item.date,
          orders: item.orders,
          sales: parseFloat(item.sales)
        })),
        
        // 热销商品
        hotGoods: hotGoods.map(item => ({
          ...item,
          price: parseFloat(item.price),
          orderCount: parseInt(item.order_count)
        }))
      };
      
      return Response.success(res, data);
      
    } catch (error) {
      console.error('获取统计数据错误:', error);
      return Response.error(res, '获取统计数据失败', 500);
    }
  }
}

module.exports = StatController;
