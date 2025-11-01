const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 用户列表
router.get('/list', userController.getList);

// 用户详情
router.get('/detail/:id', userController.getDetail);

// 切换用户状态
router.post('/toggle-status/:id', userController.toggleStatus);

module.exports = router;
