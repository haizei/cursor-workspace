const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const OrderController = require('../../controllers/admin/orderController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取订单列表
router.get('/list', OrderController.getList);

// 获取订单详情
router.get('/detail/:id', OrderController.getDetail);

// 订单发货
router.post('/deliver', [
  body('id').notEmpty().withMessage('订单ID不能为空'),
  validate
], OrderController.deliver);

// 关闭/取消订单
router.post('/close', [
  body('id').notEmpty().withMessage('订单ID不能为空'),
  validate
], OrderController.close);

module.exports = router;
