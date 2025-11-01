# 商城小程序管理后台系统

## 项目介绍

这是一个全栈一体化的商城小程序管理后台系统，集成了前端和后端功能。

### 技术栈

- **前端**: Vue.js + Element UI + Vue Router + Vuex + Axios
- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: JWT

## 功能模块

1. **商品管理** - 商品列表、新增/编辑商品、上下架、推荐设置
2. **分类管理** - 分类列表、分类编辑、排序管理
3. **轮播图管理** - 轮播图列表、编辑、上下架
4. **订单管理** - 订单列表、订单详情、发货操作
5. **用户管理** - 用户列表、用户详情、状态管理
6. **购物车管理** - 查看用户购物车
7. **收货地址管理** - 地址列表、编辑、删除
8. **数据统计** - 仪表盘展示核心数据
9. **管理员管理** - 管理员登录、权限管理

## 安装部署

### 1. 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并修改相关配置：

```bash
cp .env.example .env
```

### 3. 初始化数据库

执行 `数据库建表语句.sql` 文件，创建数据库和表结构。

### 4. 启动项目

```bash
# 开发模式（后端）
npm run dev

# 生产模式
npm start
```

前端开发：
```bash
cd frontend
npm run serve
```

### 5. 构建部署

```bash
# 构建前端
npm run build

# 启动服务器（包含静态文件服务）
npm start
```

## 默认管理员账号

- 用户名: `admin`
- 密码: `admin`

**⚠️ 首次登录后请立即修改密码！**

## 目录结构

```
mall-admin/
├── backend/            # 后端源码
│   ├── routes/         # 路由
│   ├── controllers/    # 控制器
│   ├── middleware/     # 中间件
│   ├── models/         # 数据模型
│   ├── utils/          # 工具函数
│   └── config/         # 配置文件
├── frontend/           # 前端源码
│   ├── src/            # 源代码
│   │   ├── views/      # 页面组件
│   │   ├── components/ # 公共组件
│   │   ├── api/        # API接口
│   │   ├── router/     # 路由配置
│   │   ├── store/      # 状态管理
│   │   └── utils/      # 工具函数
│   └── public/         # 静态资源
├── uploads/            # 上传文件目录
├── logs/               # 日志目录
├── server.js           # 服务器入口
└── package.json        # 项目配置
```

## API文档

API接口以 `/admin` 为前缀，需要管理员认证。

### 认证接口
- POST `/admin/auth/login` - 管理员登录
- POST `/admin/auth/logout` - 管理员登出

### 商品管理
- GET `/admin/goods/list` - 获取商品列表
- POST `/admin/goods/save` - 新增/编辑商品
- DELETE `/admin/goods/delete` - 删除商品

### 订单管理
- GET `/admin/order/list` - 获取订单列表
- GET `/admin/order/detail` - 获取订单详情
- POST `/admin/order/deliver` - 订单发货

*更多API详见项目文档*

## 注意事项

1. 生产环境请使用 HTTPS
2. 定期备份数据库
3. 及时更新依赖包
4. 设置强密码策略
5. 配置防火墙规则

## 技术支持

如有问题，请联系技术支持团队。
