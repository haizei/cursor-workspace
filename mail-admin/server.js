const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./backend/config');
const routes = require('./backend/routes');
const errorHandler = require('./backend/middleware/errorHandler');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（上传的文件）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api', routes);

// 前端静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
