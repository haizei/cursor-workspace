const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/admin/categoryController');
const authMiddleware = require('../../middleware/auth');

// 所有路由需要认证
router.use(authMiddleware);

router.get('/list', CategoryController.list);
router.get('/detail/:id', CategoryController.detail);
router.post('/save', CategoryController.save);
router.delete('/delete/:id', CategoryController.delete);

module.exports = router;
