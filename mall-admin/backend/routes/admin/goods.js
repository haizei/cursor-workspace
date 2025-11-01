const express = require('express');
const router = express.Router();
const GoodsController = require('../../controllers/admin/goodsController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', GoodsController.list);
router.get('/detail/:id', GoodsController.detail);
router.post('/save', GoodsController.save);
router.delete('/delete/:id', GoodsController.delete);
router.post('/batch-delete', GoodsController.batchDelete);
router.post('/setstatus', GoodsController.setStatus);
router.post('/batch-setstatus', GoodsController.batchSetStatus);

module.exports = router;
