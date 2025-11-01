const express = require('express');
const router = express.Router();

// 管理后台路由
const authRouter = require('./admin/auth');
const goodsRouter = require('./admin/goods');
const categoryRouter = require('./admin/category');
const bannerRouter = require('./admin/banner');
const orderRouter = require('./admin/order');
const userRouter = require('./admin/user');
const statRouter = require('./admin/stat');

// 文件上传路由
const uploadRouter = require('./upload');

// 注册管理后台路由
router.use('/admin/auth', authRouter);
router.use('/admin/goods', goodsRouter);
router.use('/admin/category', categoryRouter);
router.use('/admin/banner', bannerRouter);
router.use('/admin/order', orderRouter);
router.use('/admin/user', userRouter);
router.use('/admin/stat', statRouter);

// 注册文件上传路由
router.use('/upload', uploadRouter);

module.exports = router;
