const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/admin/categoryController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 分类列表
router.get('/list', categoryController.getList);

// 分类详情
router.get('/detail/:id', categoryController.getDetail);

// 创建分类
router.post('/save', categoryController.create);

// 更新分类
router.put('/save/:id', categoryController.update);

// 删除分类
router.delete('/delete/:id', categoryController.remove);

module.exports = router;
