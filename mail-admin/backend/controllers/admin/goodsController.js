const Goods = require('../../models/Goods');
const { success, error } = require('../../utils/response');

/**
 * 获取商品列表
 */
async function getList(req, res, next) {
  try {
    const { page = 1, pageSize = 10, name, category_id, status } = req.query;

    const conditions = {};
    if (name) conditions.name = name;
    if (category_id) conditions.category_id = category_id;
    if (status !== undefined) conditions.status = parseInt(status);

    const result = await Goods.getListWithCategory(
      parseInt(page),
      parseInt(pageSize),
      conditions
    );

    res.json(success(result));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取商品详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const goods = await Goods.findById(id);

    if (!goods) {
      return res.status(404).json(error('商品不存在', 404));
    }

    // 解析图片JSON
    if (goods.images) {
      try {
        goods.images = JSON.parse(goods.images);
      } catch (e) {
        goods.images = [];
      }
    } else {
      goods.images = [];
    }

    res.json(success(goods));
  } catch (err) {
    next(err);
  }
}

/**
 * 创建商品
 */
async function create(req, res, next) {
  try {
    const data = req.body;

    // 处理图片数组
    if (Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }

    const goods = await Goods.create(data);
    res.json(success(goods, '创建成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 更新商品
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;

    // 处理图片数组
    if (Array.isArray(data.images)) {
      data.images = JSON.stringify(data.images);
    }

    const goods = await Goods.update(id, data);
    res.json(success(goods, '更新成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 删除商品
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await Goods.delete(id);
    res.json(success(null, '删除成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 批量操作
 */
async function batchOperation(req, res, next) {
  try {
    const { ids, action } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json(error('请选择要操作的商品', 400));
    }

    if (action === 'delete') {
      for (const id of ids) {
        await Goods.delete(id);
      }
      res.json(success(null, '批量删除成功'));
    } else if (action === 'on') {
      for (const id of ids) {
        await Goods.update(id, { status: 1 });
      }
      res.json(success(null, '批量上架成功'));
    } else if (action === 'off') {
      for (const id of ids) {
        await Goods.update(id, { status: 0 });
      }
      res.json(success(null, '批量下架成功'));
    } else {
      res.status(400).json(error('不支持的操作', 400));
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  update,
  remove,
  batchOperation
};
