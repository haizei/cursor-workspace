const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const BannerController = require('../../controllers/admin/bannerController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取轮播图列表
router.get('/list', BannerController.getList);

// 获取轮播图详情
router.get('/detail/:id', BannerController.getDetail);

// 保存轮播图（新增/编辑）
router.post('/save', [
  body('name').notEmpty().withMessage('轮播图名称不能为空'),
  body('image').notEmpty().withMessage('请上传图片'),
  validate
], BannerController.save);

// 删除轮播图
router.delete('/delete/:id', BannerController.delete);

// 设置轮播图状态
router.post('/setstatus', [
  body('id').notEmpty().withMessage('轮播图ID不能为空'),
  body('status').isIn([0, 1]).withMessage('状态值错误'),
  validate
], BannerController.setStatus);

module.exports = router;
