const express = require('express');
const router = express.Router();

// 导入各模块路由
const authRoutes = require('./admin/auth');
const goodsRoutes = require('./admin/goods');
const categoryRoutes = require('./admin/category');
const bannerRoutes = require('./admin/banner');
const orderRoutes = require('./admin/order');
const userRoutes = require('./admin/user');
const cartRoutes = require('./admin/cart');
const addressRoutes = require('./admin/address');
const statRoutes = require('./admin/stat');
const uploadRoutes = require('./admin/upload');

// 注册路由
router.use('/auth', authRoutes);
router.use('/goods', goodsRoutes);
router.use('/category', categoryRoutes);
router.use('/banner', bannerRoutes);
router.use('/order', orderRoutes);
router.use('/user', userRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);
router.use('/stat', statRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
