const Goods = require('../../models/Goods');
const Response = require('../../utils/response');
const Validator = require('../../utils/validator');

/**
 * 商品管理控制器
 */
class GoodsController {
  /**
   * 获取商品列表
   */
  static async list(req, res, next) {
    try {
      const { page = 1, pageSize = 10, name, categoryId, status } = req.query;

      const params = {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        name,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        status: status !== undefined ? parseInt(status) : undefined
      };

      const list = await Goods.list(params);
      const total = await Goods.count(params);

      // 解析images字段
      list.forEach(item => {
        if (item.images) {
          try {
            item.images = JSON.parse(item.images);
          } catch (e) {
            item.images = [];
          }
        } else {
          item.images = [];
        }
      });

      res.json(Response.page(list, total, page, pageSize));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取商品详情
   */
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const goods = await Goods.findById(id);
      
      if (!goods) {
        return res.json(Response.error('商品不存在', 404));
      }

      // 解析images字段
      if (goods.images) {
        try {
          goods.images = JSON.parse(goods.images);
        } catch (e) {
          goods.images = [];
        }
      } else {
        goods.images = [];
      }

      res.json(Response.success(goods));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 新增/编辑商品
   */
  static async save(req, res, next) {
    try {
      const { id, name, price, category_id, stock } = req.body;

      // 验证必填字段
      const validation = Validator.required(
        { name, price, category_id },
        ['name', 'price', 'category_id']
      );
      if (!validation.valid) {
        return res.json(Response.error(validation.message, 400));
      }

      // 验证价格
      if (!Validator.isPrice(price)) {
        return res.json(Response.error('价格格式不正确', 400));
      }

      // 验证库存
      if (stock !== undefined && !Validator.isInteger(stock)) {
        return res.json(Response.error('库存必须是非负整数', 400));
      }

      if (id) {
        // 更新商品
        const exists = await Goods.findById(id);
        if (!exists) {
          return res.json(Response.error('商品不存在', 404));
        }

        await Goods.update(id, req.body);
        res.json(Response.success(null, '更新成功'));
      } else {
        // 新增商品
        const result = await Goods.create(req.body);
        res.json(Response.success(result, '新增成功'));
      }

    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除商品
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.json(Response.error('缺少商品ID', 400));
      }

      // 支持批量删除
      if (Array.isArray(id)) {
        await Goods.batchDelete(id);
      } else {
        await Goods.delete(id);
      }

      res.json(Response.success(null, '删除成功'));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 上下架商品
   */
  static async setStatus(req, res, next) {
    try {
      const { id, status } = req.body;

      if (!id || status === undefined) {
        return res.json(Response.error('缺少必要参数', 400));
      }

      await Goods.updateStatus(id, status);

      res.json(Response.success(null, status === 1 ? '上架成功' : '下架成功'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = GoodsController;
