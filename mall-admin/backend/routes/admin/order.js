const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/admin/orderController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', OrderController.list);
router.get('/detail/:id', OrderController.detail);
router.post('/deliver', OrderController.deliver);
router.post('/close', OrderController.close);
router.get('/export', OrderController.export);

module.exports = router;
