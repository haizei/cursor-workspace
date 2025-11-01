const Category = require('../../models/Category');
const { success, error } = require('../../utils/response');

/**
 * 获取分类列表
 */
async function getList(req, res, next) {
  try {
    const { tree } = req.query;

    if (tree === '1') {
      const treeData = await Category.getTree();
      return res.json(success(treeData));
    }

    const categories = await Category.findAll({}, { orderBy: 'sort ASC, id ASC' });
    res.json(success(categories));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取分类详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json(error('分类不存在', 404));
    }

    res.json(success(category));
  } catch (err) {
    next(err);
  }
}

/**
 * 创建分类
 */
async function create(req, res, next) {
  try {
    const data = req.body;
    const category = await Category.create(data);
    res.json(success(category, '创建成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 更新分类
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await Category.update(id, data);
    res.json(success(category, '更新成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 删除分类
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.json(success(null, '删除成功'));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getList,
  getDetail,
  create,
  update,
  remove
};
