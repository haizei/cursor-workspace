const Category = require('../../models/Category');
const Response = require('../../utils/response');
const Validator = require('../../utils/validator');

/**
 * 分类管理控制器
 */
class CategoryController {
  /**
   * 获取分类列表
   */
  static async list(req, res, next) {
    try {
      const { page, pageSize, name, parentId } = req.query;

      const params = {
        page: page ? parseInt(page) : undefined,
        pageSize: pageSize ? parseInt(pageSize) : undefined,
        name,
        parentId: parentId !== undefined ? parseInt(parentId) : undefined
      };

      const list = await Category.list(params);

      // 如果有分页参数，返回分页数据
      if (page && pageSize) {
        const total = await Category.count(params);
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
   * 获取分类详情
   */
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      
      if (!category) {
        return res.json(Response.error('分类不存在', 404));
      }

      // 获取该分类下的商品数量
      const goodsCount = await Category.getGoodsCount(id);
      category.goods_count = goodsCount;

      res.json(Response.success(category));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 新增/编辑分类
   */
  static async save(req, res, next) {
    try {
      const { id, name } = req.body;

      // 验证必填字段
      const validation = Validator.required({ name }, ['name']);
      if (!validation.valid) {
        return res.json(Response.error(validation.message, 400));
      }

      if (id) {
        // 更新分类
        const exists = await Category.findById(id);
        if (!exists) {
          return res.json(Response.error('分类不存在', 404));
        }

        await Category.update(id, req.body);
        res.json(Response.success(null, '更新成功'));
      } else {
        // 新增分类
        const result = await Category.create(req.body);
        res.json(Response.success(result, '新增成功'));
      }

    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除分类
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.json(Response.error('缺少分类ID', 400));
      }

      // 检查分类下是否有商品
      const goodsCount = await Category.getGoodsCount(id);
      if (goodsCount > 0) {
        return res.json(Response.error('该分类下还有商品，无法删除', 400));
      }

      await Category.delete(id);

      res.json(Response.success(null, '删除成功'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
