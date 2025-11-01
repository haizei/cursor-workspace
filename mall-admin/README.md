# 商城管理后台系统

全栈一体化商城管理后台，基于 Node.js + Express + Vue.js + Element UI + MySQL

## 功能特性

- 🛍️ 商品管理（增删改查、上下架、推荐设置）
- 📂 分类管理（分类列表、编辑、排序）
- 🎠 轮播图管理（图片上传、链接设置、排序）
- 📦 订单管理（订单列表、详情、发货、状态管理）
- 👥 用户管理（用户列表、状态管理、详情查看）
- 🛒 购物车管理（查看、清空）
- 📍 收货地址管理（地址列表、编辑）
- 📊 数据统计（仪表盘、核心指标）
- 🔐 权限管理（管理员登录、权限设置）

## 技术栈

### 后端
- Node.js + Express
- MySQL
- JWT 认证
- Multer 文件上传

### 前端
- Vue.js 2.x
- Vue Router
- Vuex
- Element UI
- Axios
- ECharts

## 安装运行

### 1. 安装依赖
```bash
npm run install:all
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 修改 .env 文件中的配置
```

### 3. 初始化数据库
```bash
# 执行 SQL 文件创建数据库和表
mysql -u root -p < path/to/database.sql
```

### 4. 开发模式

#### 启动后端服务
```bash
npm run dev
```

#### 启动前端开发服务器
```bash
npm run frontend:dev
```

### 5. 生产模式

#### 构建前端
```bash
npm run frontend:build
```

#### 启动服务器
```bash
npm start
```

访问: http://localhost:3000

## 默认管理员账号

- 用户名: admin
- 密码: admin

⚠️ **安全提示**: 首次登录后请立即修改默认密码！

## 目录结构

```
mall-admin/
├── backend/          # 后端源码
│   ├── routes/      # 路由
│   ├── controllers/ # 控制器
│   ├── middleware/  # 中间件
│   ├── models/      # 数据模型
│   ├── utils/       # 工具函数
│   └── config/      # 配置文件
├── frontend/        # 前端源码
│   └── src/
│       ├── views/      # 页面组件
│       ├── components/ # 公共组件
│       ├── router/     # 路由配置
│       ├── store/      # 状态管理
│       ├── api/        # API请求
│       └── utils/      # 工具函数
├── uploads/         # 上传文件目录
├── logs/           # 日志目录
├── public/         # 前端打包后的静态文件
└── server.js       # 服务器入口
```

## API 文档

详见项目需求文档中的 API 规划设计部分

## License

ISC
