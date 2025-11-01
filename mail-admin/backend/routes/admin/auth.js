const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/authController');
const authMiddleware = require('../../middleware/auth');

// 登录（不需要认证）
router.post('/login', authController.login);

// 获取当前管理员信息（需要认证）
router.get('/info', authMiddleware, authController.getCurrentAdmin);

// 修改密码（需要认证）
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
