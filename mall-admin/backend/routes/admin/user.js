const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/admin/userController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', UserController.list);
router.get('/detail/:id', UserController.detail);
router.post('/setstatus', UserController.setStatus);

module.exports = router;
