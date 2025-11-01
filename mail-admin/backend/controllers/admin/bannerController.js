const Banner = require('../../models/Banner');
const { success, error } = require('../../utils/response');

/**
 * 获取轮播图列表
 */
async function getList(req, res, next) {
  try {
    const { page = 1, pageSize = 10, status } = req.query;

    const conditions = {};
    if (status !== undefined) conditions.status = parseInt(status);

    const result = await Banner.findAll(conditions, {
      orderBy: 'sort ASC, id DESC',
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    const total = await Banner.count(conditions);

    res.json(success({
      list: result,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取轮播图详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json(error('轮播图不存在', 404));
    }

    res.json(success(banner));
  } catch (err) {
    next(err);
  }
}

/**
 * 创建轮播图
 */
async function create(req, res, next) {
  try {
    const data = req.body;
    const banner = await Banner.create(data);
    res.json(success(banner, '创建成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 更新轮播图
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const banner = await Banner.update(id, data);
    res.json(success(banner, '更新成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 删除轮播图
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await Banner.delete(id);
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
