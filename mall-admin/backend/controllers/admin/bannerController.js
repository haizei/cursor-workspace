const Banner = require('../../models/Banner');
const Response = require('../../utils/response');
const Validator = require('../../utils/validator');

/**
 * 轮播图管理控制器
 */
class BannerController {
  /**
   * 获取轮播图列表
   */
  static async list(req, res, next) {
    try {
      const { page, pageSize, name, status } = req.query;

      const params = {
        page: page ? parseInt(page) : undefined,
        pageSize: pageSize ? parseInt(pageSize) : undefined,
        name,
        status: status !== undefined ? parseInt(status) : undefined
      };

      const list = await Banner.list(params);

      // 如果有分页参数，返回分页数据
      if (page && pageSize) {
        const total = await Banner.count(params);
        res.json(Response.page(list, total, page, pageSize));
      } else {
        // 否则返回全部数据
        res.json(Response.success(list));
      }

    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取轮播图详情
   */
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const banner = await Banner.findById(id);
      
      if (!banner) {
        return res.json(Response.error('轮播图不存在', 404));
      }

      res.json(Response.success(banner));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 新增/编辑轮播图
   */
  static async save(req, res, next) {
    try {
      const { id, image } = req.body;

      // 验证必填字段
      const validation = Validator.required({ image }, ['image']);
      if (!validation.valid) {
        return res.json(Response.error(validation.message, 400));
      }

      if (id) {
        // 更新轮播图
        const exists = await Banner.findById(id);
        if (!exists) {
          return res.json(Response.error('轮播图不存在', 404));
        }

        await Banner.update(id, req.body);
        res.json(Response.success(null, '更新成功'));
      } else {
        // 新增轮播图
        const result = await Banner.create(req.body);
        res.json(Response.success(result, '新增成功'));
      }

    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除轮播图
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.json(Response.error('缺少轮播图ID', 400));
      }

      await Banner.delete(id);

      res.json(Response.success(null, '删除成功'));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 上下架轮播图
   */
  static async setStatus(req, res, next) {
    try {
      const { id, status } = req.body;

      if (!id || status === undefined) {
        return res.json(Response.error('缺少必要参数', 400));
      }

      await Banner.update(id, { status });

      res.json(Response.success(null, status === 1 ? '上架成功' : '下架成功'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = BannerController;
