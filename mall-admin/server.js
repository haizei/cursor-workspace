const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./backend/config');
const Logger = require('./backend/utils/logger');
const { errorHandler, notFoundHandler } = require('./backend/middleware/errorHandler');
const routes = require('./backend/routes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// 日志中间件
app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.path}`);
  next();
});

// API路由
app.use('/admin', routes);

// 前端路由（SPA支持）
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('前端应用未构建，请先运行: npm run frontend:build');
  }
});

// 404处理
app.use(notFoundHandler);

// 错误处理
app.use(errorHandler);

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  Logger.info(`🚀 服务器启动成功`);
  Logger.info(`📍 服务地址: http://localhost:${PORT}`);
  Logger.info(`🌍 运行环境: ${config.env}`);
});

module.exports = app;
