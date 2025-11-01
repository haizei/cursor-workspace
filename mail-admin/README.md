# 商城小程序管理后台系统

## 项目简介

商城小程序管理后台系统，全栈一体化架构，使用 Vue.js + Element UI + Node.js + Express 开发。

## 技术栈

### 前端
- Vue.js 3
- Vue Router
- Vuex
- Element UI
- Axios
- ECharts

### 后端
- Node.js
- Express
- MySQL
- JWT认证
- Multer（文件上传）

## 项目结构

```
mail-admin/
├── frontend/          # 前端源码
├── backend/          # 后端源码
├── public/           # 前端打包文件
├── uploads/          # 上传文件
├── logs/             # 日志文件
├── server.js         # 服务器入口
└── package.json      # 项目配置
```

## 安装

```bash
# 安装所有依赖
npm run install:all
```

## 开发

```bash
# 同时启动前端和后端（开发模式）
npm run dev

# 单独启动前端
npm run dev:frontend

# 单独启动后端
npm run dev:backend
```

## 构建

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 环境配置

复制 `.env.example` 为 `.env` 并配置数据库连接等信息。

## 默认管理员账号

- 用户名：admin
- 密码：admin

⚠️ 生产环境请及时修改默认密码！
