const express = require('express');
const router = express.Router();
const goodsController = require('../../controllers/admin/goodsController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 商品列表
router.get('/list', goodsController.getList);

// 商品详情
router.get('/detail/:id', goodsController.getDetail);

// 创建商品
router.post('/save', goodsController.create);

// 更新商品
router.put('/save/:id', goodsController.update);

// 删除商品
router.delete('/delete/:id', goodsController.remove);

// 批量操作
router.post('/batch', goodsController.batchOperation);

module.exports = router;
