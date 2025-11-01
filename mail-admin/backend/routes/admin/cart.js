const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/admin/cartController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取用户购物车
router.get('/user-cart/:userId', cartController.getUserCart);

// 清空用户购物车
router.post('/clear/:userId', cartController.clearCart);

module.exports = router;
