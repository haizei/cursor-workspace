const express = require('express');
const router = express.Router();
const BannerController = require('../../controllers/admin/bannerController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', BannerController.list);
router.get('/detail/:id', BannerController.detail);
router.post('/save', BannerController.save);
router.delete('/delete/:id', BannerController.delete);
router.post('/setstatus', BannerController.setStatus);

module.exports = router;
