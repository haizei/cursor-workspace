const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/admin/addressController');
const authMiddleware = require('../../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 地址列表
router.get('/list', addressController.getList);

// 地址详情
router.get('/detail/:id', addressController.getDetail);

// 创建地址
router.post('/save', addressController.create);

// 更新地址
router.put('/save/:id', addressController.update);

// 删除地址
router.delete('/delete/:id', addressController.remove);

module.exports = router;
