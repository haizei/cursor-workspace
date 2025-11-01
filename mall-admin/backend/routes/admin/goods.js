const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const GoodsController = require('../../controllers/admin/goodsController');
const authMiddleware = require('../../middleware/auth');
const validate = require('../../middleware/validator');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取商品列表
router.get('/list', GoodsController.getList);

// 获取商品详情
router.get('/detail/:id', GoodsController.getDetail);

// 保存商品（新增/编辑）
router.post('/save', [
  body('name').notEmpty().withMessage('商品名称不能为空'),
  body('price').isFloat({ min: 0 }).withMessage('价格必须大于等于0'),
  body('stock').isInt({ min: 0 }).withMessage('库存必须大于等于0'),
  body('category_id').notEmpty().withMessage('请选择分类'),
  validate
], GoodsController.save);

// 删除商品
router.delete('/delete/:id', GoodsController.delete);

// 设置商品状态
router.post('/setstatus', [
  body('id').notEmpty().withMessage('商品ID不能为空'),
  body('status').isIn([0, 1]).withMessage('状态值错误'),
  validate
], GoodsController.setStatus);

module.exports = router;
