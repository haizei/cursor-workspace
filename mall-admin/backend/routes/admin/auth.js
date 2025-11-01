const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/admin/authController');
const authMiddleware = require('../../middleware/auth');

// 登录（不需要认证）
router.post('/login', AuthController.login);

// 以下路由需要认证
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/info', authMiddleware, AuthController.getInfo);
router.post('/changepwd', authMiddleware, AuthController.changePassword);
router.get('/list', authMiddleware, AuthController.list);

module.exports = router;
