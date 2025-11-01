const express = require('express');
const router = express.Router();
const statController = require('../../controllers/admin/statController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取数据统计
router.get('/dashboard', statController.getDashboard);

module.exports = router;
