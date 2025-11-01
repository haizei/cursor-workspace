const express = require('express');
const router = express.Router();

// 中间件
const authMiddleware = require('../middleware/auth');
const errorHandler = require('../middleware/errorHandler');
const upload = require('../middleware/upload');

// 控制器
const AuthController = require('../controllers/admin/authController');
const GoodsController = require('../controllers/admin/goodsController');
const CategoryController = require('../controllers/admin/categoryController');
const BannerController = require('../controllers/admin/bannerController');
const OrderController = require('../controllers/admin/orderController');
const UserController = require('../controllers/admin/userController');
const StatController = require('../controllers/admin/statController');
const UploadController = require('../controllers/admin/uploadController');

// ==================== 认证路由（无需token） ====================
router.post('/auth/login', AuthController.login);

// ==================== 以下路由需要认证 ====================
router.use(authMiddleware);

// 认证相关
router.post('/auth/logout', AuthController.logout);
router.get('/auth/info', AuthController.getInfo);
router.post('/auth/changepwd', AuthController.changePassword);
router.get('/auth/list', AuthController.list);

// 商品管理
router.get('/goods/list', GoodsController.list);
router.get('/goods/detail/:id', GoodsController.detail);
router.post('/goods/save', GoodsController.save);
router.post('/goods/delete', GoodsController.delete);
router.post('/goods/setstatus', GoodsController.setStatus);

// 分类管理
router.get('/category/list', CategoryController.list);
router.get('/category/detail/:id', CategoryController.detail);
router.post('/category/save', CategoryController.save);
router.post('/category/delete', CategoryController.delete);

// 轮播图管理
router.get('/banner/list', BannerController.list);
router.get('/banner/detail/:id', BannerController.detail);
router.post('/banner/save', BannerController.save);
router.post('/banner/delete', BannerController.delete);
router.post('/banner/setstatus', BannerController.setStatus);

// 订单管理
router.get('/order/list', OrderController.list);
router.get('/order/detail/:id', OrderController.detail);
router.post('/order/deliver', OrderController.deliver);
router.post('/order/close', OrderController.close);

// 用户管理
router.get('/user/list', UserController.list);
router.get('/user/detail/:id', UserController.detail);
router.post('/user/setstatus', UserController.setStatus);

// 数据统计
router.get('/stat/dashboard', StatController.dashboard);

// 文件上传
router.post('/upload/image', upload.single('file'), UploadController.uploadImage);
router.post('/upload/images', upload.array('files', 10), UploadController.uploadImages);

// 错误处理
router.use(errorHandler);

module.exports = router;
