const Address = require('../../models/Address');
const { success, error } = require('../../utils/response');

/**
 * 获取用户地址列表
 */
async function getList(req, res, next) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json(error('用户ID不能为空', 400));
    }

    const addresses = await Address.getUserAddresses(userId);
    res.json(success(addresses));
  } catch (err) {
    next(err);
  }
}

/**
 * 获取地址详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json(error('地址不存在', 404));
    }

    res.json(success(address));
  } catch (err) {
    next(err);
  }
}

/**
 * 创建地址
 */
async function create(req, res, next) {
  try {
    const data = req.body;
    const address = await Address.create(data);
    res.json(success(address, '创建成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 更新地址
 */
async function update(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    const address = await Address.update(id, data);
    res.json(success(address, '更新成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 删除地址
 */
async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await Address.delete(id);
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
