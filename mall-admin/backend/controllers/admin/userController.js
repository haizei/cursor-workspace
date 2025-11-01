const db = require('../../config/database');
const Response = require('../../utils/response');
const Logger = require('../../utils/logger');

/**
 * 用户管理控制器
 */
class UserController {
  /**
   * 获取用户列表
   */
  static async getList(req, res) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        keyword = '',
        status = ''
      } = req.query;
      
      const offset = (page - 1) * pageSize;
      
      let sql = 'SELECT * FROM user WHERE 1=1';
      let countSql = 'SELECT COUNT(*) as total FROM user WHERE 1=1';
      const params = [];
      const countParams = [];
      
      if (keyword) {
        sql += ' AND (nickname LIKE ? OR phone LIKE ?)';
        countSql += ' AND (nickname LIKE ? OR phone LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
        countParams.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      if (status !== '') {
        sql += ' AND status = ?';
        countSql += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }
      
      sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, countParams);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取用户列表失败: ${error.message}`);
      res.json(Response.error('获取用户列表失败'));
    }
  }
  
  /**
   * 获取用户详情
   */
  static async getDetail(req, res) {
    try {
      const { id } = req.params;
      
      // 获取用户基本信息
      const [users] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
      
      if (users.length === 0) {
        return res.json(Response.error('用户不存在'));
      }
      
      const user = users[0];
      
      // 获取订单数量
      const [[{ orderCount }]] = await db.query(
        'SELECT COUNT(*) as orderCount FROM `order` WHERE user_id = ?',
        [id]
      );
      
      // 获取收货地址数量
      const [[{ addressCount }]] = await db.query(
        'SELECT COUNT(*) as addressCount FROM address WHERE user_id = ?',
        [id]
      );
      
      user.orderCount = orderCount;
      user.addressCount = addressCount;
      
      res.json(Response.success(user));
      
    } catch (error) {
      Logger.error(`获取用户详情失败: ${error.message}`);
      res.json(Response.error('获取用户详情失败'));
    }
  }
  
  /**
   * 设置用户状态（启用/禁用）
   */
  static async setStatus(req, res) {
    try {
      const { id, status } = req.body;
      
      await db.query('UPDATE user SET status = ? WHERE id = ?', [status, id]);
      
      Logger.info(`设置用户状态成功 (ID: ${id}, Status: ${status})`);
      res.json(Response.success(null, '设置成功'));
      
    } catch (error) {
      Logger.error(`设置用户状态失败: ${error.message}`);
      res.json(Response.error('设置用户状态失败'));
    }
  }
}

module.exports = UserController;
