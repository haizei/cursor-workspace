const Order = require('../../models/Order');
const Response = require('../../utils/response');

/**
 * 订单管理控制器
 */
class OrderController {
  /**
   * 获取订单列表
   */
  static async list(req, res, next) {
    try {
      const { page = 1, pageSize = 10, orderNo, status, startTime, endTime } = req.query;

      const params = {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        orderNo,
        status: status !== undefined ? parseInt(status) : undefined,
        startTime,
        endTime
      };

      const list = await Order.list(params);
      const total = await Order.count(params);

      res.json(Response.page(list, total, page, pageSize));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取订单详情
   */
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);
      
      if (!order) {
        return res.json(Response.error('订单不存在', 404));
      }

      // 获取订单商品
      const items = await Order.getOrderItems(id);
      order.items = items;

      res.json(Response.success(order));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 订单发货
   */
  static async deliver(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.json(Response.error('缺少订单ID', 400));
      }

      const order = await Order.findById(id);
      
      if (!order) {
        return res.json(Response.error('订单不存在', 404));
      }

      if (order.status !== 1) {
        return res.json(Response.error('订单状态不正确，无法发货', 400));
      }

      await Order.updateStatus(id, 2); // 2 = 已发货

      res.json(Response.success(null, '发货成功'));

    } catch (error) {
      next(error);
    }
  }

  /**
   * 关闭订单
   */
  static async close(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.json(Response.error('缺少订单ID', 400));
      }

      const order = await Order.findById(id);
      
      if (!order) {
        return res.json(Response.error('订单不存在', 404));
      }

      if (order.status === 3 || order.status === 4) {
        return res.json(Response.error('订单已完成或已关闭', 400));
      }

      await Order.updateStatus(id, 4); // 4 = 已关闭

      res.json(Response.success(null, '订单已关闭'));

    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
