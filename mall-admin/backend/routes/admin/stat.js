const express = require('express');
const router = express.Router();
const StatController = require('../../controllers/admin/statController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取仪表盘统计数据
router.get('/dashboard', StatController.getDashboard);

module.exports = router;
