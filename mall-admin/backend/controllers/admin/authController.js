const bcrypt = require('bcrypt');
const db = require('../../config/database');
const Response = require('../../utils/response');
const JWTUtil = require('../../utils/jwt');
const Logger = require('../../utils/logger');

/**
 * 管理员认证控制器
 */
class AuthController {
  /**
   * 管理员登录
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // 查询管理员
      const [admins] = await db.query(
        'SELECT * FROM admin WHERE username = ? AND status = 1',
        [username]
      );
      
      if (admins.length === 0) {
        return res.json(Response.error('用户名或密码错误'));
      }
      
      const admin = admins[0];
      
      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        return res.json(Response.error('用户名或密码错误'));
      }
      
      // 生成token
      const token = JWTUtil.sign({
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname
      });
      
      // 更新最后登录时间和IP
      await db.query(
        'UPDATE admin SET last_login_time = NOW(), last_login_ip = ? WHERE id = ?',
        [req.ip, admin.id]
      );
      
      Logger.info(`管理员 ${username} 登录成功`);
      
      // 返回token和管理员信息
      res.json(Response.success({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          avatar: admin.avatar
        }
      }, '登录成功'));
      
    } catch (error) {
      Logger.error(`登录失败: ${error.message}`);
      res.json(Response.error('登录失败'));
    }
  }
  
  /**
   * 管理员退出登录
   */
  static async logout(req, res) {
    try {
      Logger.info(`管理员 ${req.admin.username} 退出登录`);
      res.json(Response.success(null, '退出登录成功'));
    } catch (error) {
      Logger.error(`退出登录失败: ${error.message}`);
      res.json(Response.error('退出登录失败'));
    }
  }
  
  /**
   * 修改密码
   */
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const adminId = req.admin.id;
      
      // 查询管理员
      const [admins] = await db.query('SELECT * FROM admin WHERE id = ?', [adminId]);
      
      if (admins.length === 0) {
        return res.json(Response.error('管理员不存在'));
      }
      
      const admin = admins[0];
      
      // 验证旧密码
      const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      
      if (!isPasswordValid) {
        return res.json(Response.error('原密码错误'));
      }
      
      // 加密新密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // 更新密码
      await db.query('UPDATE admin SET password = ? WHERE id = ?', [hashedPassword, adminId]);
      
      Logger.info(`管理员 ${admin.username} 修改密码成功`);
      
      res.json(Response.success(null, '密码修改成功'));
      
    } catch (error) {
      Logger.error(`修改密码失败: ${error.message}`);
      res.json(Response.error('修改密码失败'));
    }
  }
  
  /**
   * 获取管理员列表
   */
  static async getAdminList(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = req.query;
      const offset = (page - 1) * pageSize;
      
      let sql = 'SELECT id, username, nickname, avatar, status, last_login_time, create_time FROM admin';
      let countSql = 'SELECT COUNT(*) as total FROM admin';
      const params = [];
      
      if (keyword) {
        sql += ' WHERE username LIKE ? OR nickname LIKE ?';
        countSql += ' WHERE username LIKE ? OR nickname LIKE ?';
        params.push(`%${keyword}%`, `%${keyword}%`);
      }
      
      sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      params.push(parseInt(pageSize), parseInt(offset));
      
      const [list] = await db.query(sql, params);
      const [[{ total }]] = await db.query(countSql, keyword ? [`%${keyword}%`, `%${keyword}%`] : []);
      
      res.json(Response.page(list, total, parseInt(page), parseInt(pageSize)));
      
    } catch (error) {
      Logger.error(`获取管理员列表失败: ${error.message}`);
      res.json(Response.error('获取管理员列表失败'));
    }
  }
}

module.exports = AuthController;
