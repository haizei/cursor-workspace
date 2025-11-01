const db = require('../../config/database');
const Crypto = require('../../utils/crypto');
const JWT = require('../../utils/jwt');
const Response = require('../../utils/response');

class AuthController {
  /**
   * 管理员登录
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return Response.error(res, '用户名和密码不能为空', 400);
      }
      
      // 查询管理员
      const [admins] = await db.query(
        'SELECT * FROM admin WHERE username = ? AND status = 1',
        [username]
      );
      
      if (admins.length === 0) {
        return Response.error(res, '用户名或密码错误', 401);
      }
      
      const admin = admins[0];
      
      // 验证密码（如果是加密的）
      let isPasswordValid = false;
      
      // 尝试bcrypt验证
      try {
        isPasswordValid = await Crypto.compare(password, admin.password);
      } catch (e) {
        // 如果不是bcrypt加密，直接比对明文
        isPasswordValid = password === admin.password;
      }
      
      if (!isPasswordValid) {
        return Response.error(res, '用户名或密码错误', 401);
      }
      
      // 更新最后登录时间和IP
      await db.query(
        'UPDATE admin SET last_login_time = NOW(), last_login_ip = ? WHERE id = ?',
        [req.ip, admin.id]
      );
      
      // 生成token
      const token = JWT.generate({
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname
      });
      
      // 返回用户信息和token
      return Response.success(res, {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          avatar: admin.avatar,
          permissions: admin.permissions ? JSON.parse(admin.permissions) : []
        }
      }, '登录成功');
      
    } catch (error) {
      console.error('登录错误:', error);
      return Response.error(res, '登录失败，请稍后重试', 500);
    }
  }
  
  /**
   * 获取当前管理员信息
   */
  static async getInfo(req, res) {
    try {
      const [admins] = await db.query(
        'SELECT id, username, nickname, avatar, permissions, status FROM admin WHERE id = ?',
        [req.admin.id]
      );
      
      if (admins.length === 0) {
        return Response.error(res, '管理员不存在', 404);
      }
      
      const admin = admins[0];
      
      return Response.success(res, {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : []
      });
      
    } catch (error) {
      console.error('获取管理员信息错误:', error);
      return Response.error(res, '获取信息失败', 500);
    }
  }
  
  /**
   * 退出登录
   */
  static async logout(req, res) {
    // Token方式登出只需前端清除token即可
    return Response.success(res, null, '退出登录成功');
  }
  
  /**
   * 修改密码
   */
  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return Response.error(res, '旧密码和新密码不能为空', 400);
      }
      
      if (newPassword.length < 6) {
        return Response.error(res, '新密码长度不能少于6位', 400);
      }
      
      // 查询当前管理员
      const [admins] = await db.query(
        'SELECT * FROM admin WHERE id = ?',
        [req.admin.id]
      );
      
      if (admins.length === 0) {
        return Response.error(res, '管理员不存在', 404);
      }
      
      const admin = admins[0];
      
      // 验证旧密码
      let isPasswordValid = false;
      try {
        isPasswordValid = await Crypto.compare(oldPassword, admin.password);
      } catch (e) {
        isPasswordValid = oldPassword === admin.password;
      }
      
      if (!isPasswordValid) {
        return Response.error(res, '旧密码错误', 401);
      }
      
      // 加密新密码
      const hashedPassword = await Crypto.hash(newPassword);
      
      // 更新密码
      await db.query(
        'UPDATE admin SET password = ? WHERE id = ?',
        [hashedPassword, req.admin.id]
      );
      
      return Response.success(res, null, '密码修改成功');
      
    } catch (error) {
      console.error('修改密码错误:', error);
      return Response.error(res, '修改密码失败', 500);
    }
  }
  
  /**
   * 获取管理员列表
   */
  static async list(req, res) {
    try {
      const { page = 1, pageSize = 10, keyword } = req.query;
      const offset = (page - 1) * pageSize;
      
      let whereClause = '';
      let params = [];
      
      if (keyword) {
        whereClause = 'WHERE username LIKE ? OR nickname LIKE ?';
        params = [`%${keyword}%`, `%${keyword}%`];
      }
      
      // 查询总数
      const [countResult] = await db.query(
        `SELECT COUNT(*) as total FROM admin ${whereClause}`,
        params
      );
      const total = countResult[0].total;
      
      // 查询列表
      const [admins] = await db.query(
        `SELECT id, username, nickname, avatar, status, last_login_time, create_time 
         FROM admin ${whereClause} 
         ORDER BY id DESC 
         LIMIT ? OFFSET ?`,
        [...params, parseInt(pageSize), offset]
      );
      
      return Response.page(res, admins, total, page, pageSize);
      
    } catch (error) {
      console.error('获取管理员列表错误:', error);
      return Response.error(res, '获取列表失败', 500);
    }
  }
}

module.exports = AuthController;
