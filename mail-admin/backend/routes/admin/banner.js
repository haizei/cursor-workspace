const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/admin/bannerController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 轮播图列表
router.get('/list', bannerController.getList);

// 轮播图详情
router.get('/detail/:id', bannerController.getDetail);

// 创建轮播图
router.post('/save', bannerController.create);

// 更新轮播图
router.put('/save/:id', bannerController.update);

// 删除轮播图
router.delete('/delete/:id', bannerController.remove);

module.exports = router;
