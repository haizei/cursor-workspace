# 商城小程序管理后台系统

全栈一体化管理后台，采用 Node.js + Express + Vue.js + Element UI 开发。

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
复制 `.env.example` 为 `.env`，并修改数据库配置：
```bash
cp .env.example .env
```

### 3. 创建数据库
执行项目需求文档中的数据库建表语句。

### 4. 开发模式

**启动后端服务器**
```bash
npm run dev
```

**启动前端开发服务器**
```bash
npm run frontend:dev
```

### 5. 生产模式

**构建前端**
```bash
npm run frontend:build
```

**启动服务器**
```bash
npm start
```

访问: http://localhost:3000

## 默认账号

- 用户名: admin
- 密码: admin

## 功能模块

1. **数据统计** - 首页仪表盘
2. **商品管理** - 商品列表、新增/编辑
3. **分类管理** - 分类列表、新增/编辑
4. **轮播图管理** - 轮播图列表、新增/编辑
5. **订单管理** - 订单列表、订单详情
6. **用户管理** - 用户列表、用户详情
7. **购物车管理** - 用户购物车查看
8. **收货地址管理** - 地址列表、编辑

## 目录结构

```
mall-admin/
├── backend/          # 后端源码
├── frontend/         # 前端源码
├── public/           # 前端打包输出
├── uploads/          # 上传文件
├── server.js         # 服务器入口
└── package.json      # 项目配置
```

## License

MIT
