const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const UserController = require('../../controllers/admin/userController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取用户列表
router.get('/list', UserController.getList);

// 获取用户详情
router.get('/detail/:id', UserController.getDetail);

// 设置用户状态
router.post('/setstatus', [
  body('id').notEmpty().withMessage('用户ID不能为空'),
  body('status').isIn([0, 1]).withMessage('状态值错误'),
  validate
], UserController.setStatus);

module.exports = router;
