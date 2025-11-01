const db = require('../../config/database');
const Response = require('../../utils/response');

class UserController {
  /**
   * 获取用户列表
   */
  static async list(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword, status } = req.query;
      const offset = (page - 1) * pageSize;
      
      let whereClause = 'WHERE 1=1';
      let params = [];
      
      if (keyword) {
        whereClause += ' AND (nickname LIKE ? OR phone LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      if (status !== undefined && status !== '') {
        whereClause += ' AND status = ?';
        params.push(status);
      }
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM user ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [users] = await db.query(
        `SELECT id, openid, nickname, avatar, phone, gender, status, create_time
         FROM user
         ${whereClause}
         ORDER BY id DESC
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      return Response.page(res, users, total, page, pageSize);
      
    } catch (error) {
      console.error('获取用户列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
  
  /**
   * 获取用户详情
   */
  static async detail(req, res) {
    try {
      const { id } = req.params;
      
      // 查询用户基本信息
      const [users] = await db.query(
        'SELECT id, openid, nickname, avatar, phone, gender, status, create_time FROM user WHERE id = ?',
        [id]
      );
      
      if (users.length === 0) {
        return Response.error(res, '用户不存在', 404);
      }
      
      const user = users[0];
      
      // 查询订单数量
      const [orderCount] = await db.query(
        'SELECT COUNT(*) as count FROM `order` WHERE user_id = ?',
        [id]
      );
      user.order_count = orderCount[0].count;
      
      // 查询收货地址数量
      const [addressCount] = await db.query(
        'SELECT COUNT(*) as count FROM address WHERE user_id = ?',
        [id]
      );
      user.address_count = addressCount[0].count;
      
      return Response.success(res, user);
      
    } catch (error) {
      console.error('获取用户详情错误:', error);
      return Response.error(res, '获取详情失败', 500);
    }
  }
  
  /**
   * 设置用户状态
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE user SET status = ? WHERE id = ?', [status, id]);
      
      return Response.success(res, null, '状态更新成功');
      
    } catch (error) {
      console.error('更新用户状态错误:', error);
      return Response.error(res, '状态更新失败', 500);
    }
  }
}

module.exports = UserController;
