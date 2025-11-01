const pool = require('../../config/database');
const { success, error } = require('../../utils/response');

/**
 * 获取数据统计
 */
async function getDashboard(req, res, next) {
  try {
    // 订单总数
    const [orderTotal] = await pool.execute('SELECT COUNT(*) as count FROM `order`');
    
    // 订单总金额
    const [orderAmount] = await pool.execute('SELECT SUM(total_amount) as total FROM `order` WHERE status IN (1,2,3)');
    
    // 用户总数
    const [userTotal] = await pool.execute('SELECT COUNT(*) as count FROM user');
    
    // 商品总数
    const [goodsTotal] = await pool.execute('SELECT COUNT(*) as count FROM goods');
    
    // 今日新增订单
    const [todayOrders] = await pool.execute(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total 
      FROM \`order\` 
      WHERE DATE(create_time) = CURDATE()
    `);
    
    // 今日新增用户
    const [todayUsers] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM user 
      WHERE DATE(create_time) = CURDATE()
    `);
    
    // 本月新增订单
    const [monthOrders] = await pool.execute(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total 
      FROM \`order\` 
      WHERE YEAR(create_time) = YEAR(CURDATE()) AND MONTH(create_time) = MONTH(CURDATE())
    `);
    
    // 本月新增用户
    const [monthUsers] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM user 
      WHERE YEAR(create_time) = YEAR(CURDATE()) AND MONTH(create_time) = MONTH(CURDATE())
    `);

    res.json(success({
      order_total: orderTotal[0].count,
      order_amount: parseFloat(orderAmount[0].total || 0),
      user_total: userTotal[0].count,
      goods_total: goodsTotal[0].count,
      today_orders: todayOrders[0].count,
      today_order_amount: parseFloat(todayOrders[0].total || 0),
      today_users: todayUsers[0].count,
      month_orders: monthOrders[0].count,
      month_order_amount: parseFloat(monthOrders[0].total || 0),
      month_users: monthUsers[0].count
    }));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard
};
