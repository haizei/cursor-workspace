const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const CategoryController = require('../../controllers/admin/categoryController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取分类列表
router.get('/list', CategoryController.getList);

// 获取所有分类（不分页）
router.get('/all', CategoryController.getAll);

// 获取分类详情
router.get('/detail/:id', CategoryController.getDetail);

// 保存分类（新增/编辑）
router.post('/save', [
  body('name').notEmpty().withMessage('分类名称不能为空'),
  validate
], CategoryController.save);

// 删除分类
router.delete('/delete/:id', CategoryController.delete);

module.exports = router;
