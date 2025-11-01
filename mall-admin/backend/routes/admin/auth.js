const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../../controllers/admin/authController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 管理员登录（不需要认证）
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空'),
  validate
], AuthController.login);

// 管理员退出登录（需要认证）
router.post('/logout', authMiddleware, AuthController.logout);

// 修改密码（需要认证）
router.post('/changepwd', [
  authMiddleware,
  body('oldPassword').notEmpty().withMessage('原密码不能为空'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少6位'),
  validate
], AuthController.changePassword);

// 获取管理员列表（需要认证）
router.get('/list', authMiddleware, AuthController.getAdminList);

module.exports = router;
