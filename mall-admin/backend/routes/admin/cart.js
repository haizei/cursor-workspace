const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/admin/cartController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/usercart', CartController.userCart);
router.post('/clear', CartController.clear);

module.exports = router;
