const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 订单列表
router.get('/list', orderController.getList);

// 订单详情
router.get('/detail/:id', orderController.getDetail);

// 订单发货
router.post('/deliver/:id', orderController.deliver);

// 关闭订单
router.post('/close/:id', orderController.close);

module.exports = router;
