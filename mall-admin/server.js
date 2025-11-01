const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const config = require('./backend/config');
const routes = require('./backend/routes');
const errorHandler = require('./backend/middleware/errorHandler');
const Logger = require('./backend/utils/logger');

const app = express();

// 中间件
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析JSON
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public'))); // 前端打包文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 上传文件访问

// 请求日志
app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.url}`);
  next();
});

// API路由
app.use('/api', routes);

// 前端路由（支持SPA）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(config.port, () => {
  console.log('=================================');
  console.log('🚀 商城管理后台启动成功！');
  console.log(`🌐 服务器地址: http://localhost:${config.port}`);
  console.log(`📝 环境: ${config.env}`);
  console.log('=================================');
  Logger.info(`服务器启动成功 - 端口: ${config.port}`);
});

// 优雅退出
process.on('SIGINT', () => {
  Logger.info('服务器正在关闭...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  Logger.error(`未捕获的异常: ${error.message}`);
  Logger.error(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  Logger.error('未处理的Promise拒绝:', reason);
});
