const express = require('express');
const router = express.Router();

// 管理员路由
const authRoutes = require('./admin/auth');
const goodsRoutes = require('./admin/goods');
const categoryRoutes = require('./admin/category');
const bannerRoutes = require('./admin/banner');
const orderRoutes = require('./admin/order');
const userRoutes = require('./admin/user');
const cartRoutes = require('./admin/cart');
const addressRoutes = require('./admin/address');
const statRoutes = require('./admin/stat');

// 文件上传路由
const uploadRoutes = require('../controllers/uploadController');

// 注册路由
router.use('/admin/auth', authRoutes);
router.use('/admin/goods', goodsRoutes);
router.use('/admin/category', categoryRoutes);
router.use('/admin/banner', bannerRoutes);
router.use('/admin/order', orderRoutes);
router.use('/admin/user', userRoutes);
router.use('/admin/cart', cartRoutes);
router.use('/admin/address', addressRoutes);
router.use('/admin/stat', statRoutes);

// 文件上传
router.post('/admin/upload/image', uploadRoutes.upload.single('file'), uploadRoutes.uploadImage);

module.exports = router;
