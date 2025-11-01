const User = require('../../models/User');
const { success, error } = require('../../utils/response');

/**
 * 获取用户列表
 */
async function getList(req, res, next) {
  try {
    const { page = 1, pageSize = 10, nickname, phone, status } = req.query;

    const conditions = {};
    if (nickname) conditions.nickname = nickname;
    if (phone) conditions.phone = phone;
    if (status !== undefined) conditions.status = parseInt(status);

    const result = await User.getList(
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
 * 获取用户详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    // 获取用户的订单数和地址数
    const pool = require('../../config/database');
    const [orderCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM `order` WHERE user_id = ?',
      [id]
    );
    const [addressCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM address WHERE user_id = ?',
      [id]
    );

    res.json(success({
      ...user,
      order_count: orderCount[0].count,
      address_count: addressCount[0].count
    }));
  } catch (err) {
    next(err);
  }
}

/**
 * 切换用户状态
 */
async function toggleStatus(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    const newStatus = user.status === 1 ? 0 : 1;
    await User.update(id, { status: newStatus });

    res.json(success(null, `用户已${newStatus === 1 ? '启用' : '禁用'}`));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getList,
  getDetail,
  toggleStatus
};
