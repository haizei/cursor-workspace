const Admin = require('../../models/Admin');
const CryptoUtil = require('../../utils/crypto');
const JwtUtil = require('../../utils/jwt');
const Response = require('../../utils/response');
const Validator = require('../../utils/validator');

/**
 * 管理员认证控制器
 */
class AuthController {
  /**
   * 管理员登录
   */
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // 验证必填字段
      const validation = Validator.required({ username, password }, ['username', 'password']);
      if (!validation.valid) {
        return res.json(Response.error(validation.message, 400));
      }

      // 查找管理员
      const admin = await Admin.findByUsername(username);
      if (!admin) {
        return res.json(Response.error('用户名或密码错误', 400));
      }

      // 检查状态
      if (admin.status !== 1) {
        return res.json(Response.error('账号已被禁用', 403));
      }

      // 验证密码
      let passwordValid = false;
      
      // 兼容明文密码（仅用于初始化的admin账号）
      if (admin.password === password) {
        passwordValid = true;
        // 如果是明文密码，登录后自动加密
        const hashedPassword = await CryptoUtil.hashPassword(password);
        await Admin.update(admin.id, { password: hashedPassword });
      } else {
        // 验证加密密码
        passwordValid = await CryptoUtil.comparePassword(password, admin.password);
      }

      if (!passwordValid) {
        return res.json(Response.error('用户名或密码错误', 400));
      }

      // 更新最后登录信息
      const ip = req.ip || req.connection.remoteAddress;
      await Admin.updateLastLogin(admin.id, ip);

      // 生成Token
      const token = JwtUtil.sign({
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname
      });

      // 返回结果
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
      next(error);
    }
  }

  /**
   * 管理员登出
   */
  static async logout(req, res, next) {
    try {
      // 实际上JWT是无状态的，登出只需要前端清除token
      res.json(Response.success(null, '登出成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前管理员信息
   */
  static async getInfo(req, res, next) {
    try {
      const admin = await Admin.findById(req.admin.id);
      
      if (!admin) {
        return res.json(Response.error('管理员不存在', 404));
      }

      res.json(Response.success({
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar,
        permissions: admin.permissions ? JSON.parse(admin.permissions) : []
      }));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;

      // 验证必填字段
      const validation = Validator.required({ oldPassword, newPassword }, ['oldPassword', 'newPassword']);
      if (!validation.valid) {
        return res.json(Response.error(validation.message, 400));
      }

      // 查找管理员
      const admin = await Admin.findById(req.admin.id);
      if (!admin) {
        return res.json(Response.error('管理员不存在', 404));
      }

      // 验证旧密码
      const valid = await CryptoUtil.comparePassword(oldPassword, admin.password);
      if (!valid) {
        return res.json(Response.error('旧密码错误', 400));
      }

      // 加密新密码
      const hashedPassword = await CryptoUtil.hashPassword(newPassword);

      // 更新密码
      await Admin.update(admin.id, { password: hashedPassword });

      res.json(Response.success(null, '密码修改成功'));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取管理员列表
   */
  static async list(req, res, next) {
    try {
      const { page = 1, pageSize = 10 } = req.query;

      const list = await Admin.list(parseInt(page), parseInt(pageSize));
      const total = await Admin.count();

      res.json(Response.page(list, total, page, pageSize));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
