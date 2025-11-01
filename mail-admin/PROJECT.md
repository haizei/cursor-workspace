# 商城管理后台系统

## 项目简介

这是一个基于 Vue.js + Element UI + Node.js + Express 的全栈一体化商城管理后台系统。

## 项目结构

```
mail-admin/
├── frontend/              # 前端源码目录
│   ├── src/
│   │   ├── api/          # API请求封装
│   │   ├── components/   # 公共组件
│   │   │   └── Layout/  # 布局组件（包含左侧树形菜单）
│   │   ├── router/       # 路由配置
│   │   ├── store/        # 状态管理
│   │   ├── views/        # 页面组件
│   │   │   ├── goods/    # 商品管理
│   │   │   ├── category/ # 分类管理
│   │   │   ├── banner/   # 轮播图管理
│   │   │   ├── order/    # 订单管理
│   │   │   ├── user/     # 用户管理
│   │   │   └── settings/ # 系统设置
│   │   └── main.js       # 入口文件
│   └── package.json
├── backend/               # 后端源码目录
│   ├── routes/           # 路由定义
│   ├── controllers/      # 控制器
│   ├── models/           # 数据模型
│   ├── middleware/       # 中间件
│   ├── utils/            # 工具函数
│   └── config/           # 配置文件
├── public/               # 前端打包文件目录
├── uploads/              # 上传文件目录
├── logs/                 # 日志目录
├── server.js             # 服务器入口
└── package.json          # 项目配置
```

## 功能特性

### 1. 左侧树形菜单
- 采用 Element UI 的 Menu 组件实现树形结构
- 支持多级菜单展开/收起
- 菜单项包含图标和文字

### 2. 商品管理
- 商品列表（支持搜索、筛选、分页）
- 商品编辑（新增/编辑商品信息）
- 商品图片上传（主图、轮播图）
- 批量操作（批量上下架、批量删除）

### 3. 分类管理
- 分类列表
- 分类编辑（支持一级、二级分类）
- 分类图片上传

### 4. 轮播图管理
- 轮播图列表
- 轮播图编辑
- 支持设置跳转链接

### 5. 订单管理
- 订单列表（支持搜索、筛选、分页）
- 订单详情查看
- 订单发货操作
- 订单关闭操作

### 6. 用户管理
- 用户列表（支持搜索、筛选、分页）
- 用户详情查看
- 用户状态切换（启用/禁用）

### 7. 数据统计
- 订单总数、订单总金额
- 用户总数、商品总数
- 今日/本月数据统计

### 8. 系统设置
- 管理员密码修改

## 技术栈

### 前端
- Vue.js 3
- Vue Router 4
- Vuex 4
- Element Plus
- Axios
- ECharts

### 后端
- Node.js
- Express
- MySQL2
- bcryptjs
- jsonwebtoken
- multer

## 安装和运行

### 1. 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..
```

或者使用一键安装：

```bash
npm run install:all
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改数据库配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mall
```

### 3. 创建数据库

执行 `数据库建表语句.sql` 创建数据库和表结构。

### 4. 运行项目

开发模式（同时启动前端和后端）：

```bash
npm run dev
```

单独启动：

```bash
# 启动后端
npm run dev:backend

# 启动前端（新终端）
npm run dev:frontend
```

生产模式：

```bash
# 构建前端
npm run build

# 启动服务器
npm start
```

## 默认账号

- 用户名：admin
- 密码：admin

⚠️ 生产环境请及时修改默认密码！

## API接口

所有管理后台API以 `/api/admin` 开头，需要JWT认证。

### 认证相关
- POST `/api/admin/auth/login` - 管理员登录
- GET `/api/admin/auth/info` - 获取当前管理员信息
- POST `/api/admin/auth/change-password` - 修改密码

### 商品管理
- GET `/api/admin/goods/list` - 获取商品列表
- GET `/api/admin/goods/detail/:id` - 获取商品详情
- POST `/api/admin/goods/save` - 创建商品
- PUT `/api/admin/goods/save/:id` - 更新商品
- DELETE `/api/admin/goods/delete/:id` - 删除商品
- POST `/api/admin/goods/batch` - 批量操作

### 分类管理
- GET `/api/admin/category/list` - 获取分类列表
- POST `/api/admin/category/save` - 创建分类
- PUT `/api/admin/category/save/:id` - 更新分类
- DELETE `/api/admin/category/delete/:id` - 删除分类

### 轮播图管理
- GET `/api/admin/banner/list` - 获取轮播图列表
- POST `/api/admin/banner/save` - 创建轮播图
- PUT `/api/admin/banner/save/:id` - 更新轮播图
- DELETE `/api/admin/banner/delete/:id` - 删除轮播图

### 订单管理
- GET `/api/admin/order/list` - 获取订单列表
- GET `/api/admin/order/detail/:id` - 获取订单详情
- POST `/api/admin/order/deliver/:id` - 订单发货
- POST `/api/admin/order/close/:id` - 关闭订单

### 用户管理
- GET `/api/admin/user/list` - 获取用户列表
- GET `/api/admin/user/detail/:id` - 获取用户详情
- POST `/api/admin/user/toggle-status/:id` - 切换用户状态

### 数据统计
- GET `/api/admin/stat/dashboard` - 获取数据统计

### 文件上传
- POST `/api/admin/upload/image` - 上传图片

## 菜单结构

左侧菜单采用树形结构展示：

```
- 数据统计
- 商品管理
  └─ 商品列表
- 分类管理
  └─ 分类列表
- 轮播图管理
  └─ 轮播图列表
- 订单管理
  └─ 订单列表
- 用户管理
  └─ 用户列表
- 系统设置
```

## 注意事项

1. 确保 MySQL 数据库已创建并执行建表语句
2. 生产环境请修改 JWT_SECRET 和数据库密码
3. 上传文件目录需要写权限
4. 首次登录后系统会自动将明文密码加密存储

## 开发说明

- 前端开发：在 `frontend/` 目录下进行，使用 `npm run serve` 启动开发服务器
- 后端开发：在 `backend/` 目录下进行，修改后自动重启（nodemon）
- API 请求统一通过 `frontend/src/api/` 目录下的文件封装
- 路由守卫会自动检查登录状态，未登录会跳转到登录页

## 许可证

MIT
