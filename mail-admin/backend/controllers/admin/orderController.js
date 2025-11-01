const Order = require('../../models/Order');
const { success, error } = require('../../utils/response');

/**
 * 获取订单列表
 */
async function getList(req, res, next) {
  try {
    const { page = 1, pageSize = 10, order_no, status, start_time, end_time } = req.query;

    const conditions = {};
    if (order_no) conditions.order_no = order_no;
    if (status !== undefined) conditions.status = parseInt(status);
    if (start_time) conditions.start_time = start_time;
    if (end_time) conditions.end_time = end_time;

    const result = await Order.getListWithUser(
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
 * 获取订单详情
 */
async function getDetail(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.getDetailWithItems(id);

    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }

    res.json(success(order));
  } catch (err) {
    next(err);
  }
}

/**
 * 订单发货
 */
async function deliver(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }

    if (order.status !== 1) {
      return res.status(400).json(error('订单状态不正确，无法发货', 400));
    }

    await Order.update(id, {
      status: 2,
      deliver_time: new Date()
    });

    res.json(success(null, '发货成功'));
  } catch (err) {
    next(err);
  }
}

/**
 * 关闭订单
 */
async function close(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json(error('订单不存在', 404));
    }

    await Order.update(id, { status: 4 });

    res.json(success(null, '订单已关闭'));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getList,
  getDetail,
  deliver,
  close
};
