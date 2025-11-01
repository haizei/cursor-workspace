const User = require('../../models/User');
const Response = require('../../utils/response');

/**
 * 用户管理控制器
 */
class UserController {
  /**
   * 获取用户列表
   */
  static async list(req, res, next) {
    try {
      const { page = 1, pageSize = 10, nickname, phone, status } = req.query;

      const params = {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        nickname,
        phone,
        status: status !== undefined ? parseInt(status) : undefined
      };

      const list = await User.list(params);
      const total = await User.count(params);

      res.json(Response.page(list, total, page, pageSize));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取用户详情
   */
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.getDetail(id);
      
      if (!user) {
        return res.json(Response.error('用户不存在', 404));
      }

      res.json(Response.success(user));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 设置用户状态
   */
  static async setStatus(req, res, next) {
    try {
      const { id, status } = req.body;

      if (!id || status === undefined) {
        return res.json(Response.error('缺少必要参数', 400));
      }

      await User.updateStatus(id, status);

      res.json(Response.success(null, status === 1 ? '启用成功' : '禁用成功'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
