const express = require('express');
const router = express.Router();
const StatController = require('../../controllers/admin/statController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/dashboard', StatController.dashboard);

module.exports = router;
