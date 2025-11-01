# 商城管理后台安装指南

## 一、环境要求

### 必需软件
- **Node.js**: 14.x 或更高版本
- **MySQL**: 5.7 或更高版本
- **npm**: 6.x 或更高版本

### 推荐软件
- **Git**: 用于版本控制
- **VSCode**: 推荐的开发工具

## 二、数据库准备

### 1. 创建数据库

登录MySQL，执行以下命令：

```bash
mysql -u root -p
```

然后创建数据库：

```sql
CREATE DATABASE IF NOT EXISTS `mall` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 执行建表语句

在项目根目录的上级目录找到 `商城小程序项目需求/数据库建表语句.sql` 文件，执行该文件：

```bash
mysql -u root -p mall < ../商城小程序项目需求/数据库建表语句.sql
```

或者在MySQL命令行中：

```sql
USE mall;
SOURCE /path/to/数据库建表语句.sql;
```

### 3. 验证数据

确认数据库已创建成功：

```sql
USE mall;
SHOW TABLES;
SELECT * FROM admin;  -- 应该看到默认的admin账号
```

## 三、后端安装

### 1. 配置环境变量

在项目根目录复制环境变量配置文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=mall

JWT_SECRET=your_random_secret_key_12345
JWT_EXPIRES_IN=7d
```

**重要**: 请修改 `DB_PASSWORD` 为你的MySQL密码，并修改 `JWT_SECRET` 为一个随机字符串。

### 2. 安装依赖

```bash
npm install
```

### 3. 启动后端服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

启动成功后，你会看到：
```
========================================
🚀 服务器启动成功！
📡 端口: 3000
🌍 环境: development
🔗 访问地址: http://localhost:3000
========================================
✅ 数据库连接成功
```

## 四、前端安装

### 1. 进入前端目录

```bash
cd frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动前端开发服务器

```bash
npm run serve
```

启动成功后，你会看到：
```
App running at:
- Local:   http://localhost:8080/
- Network: http://192.168.x.x:8080/
```

### 4. 访问系统

在浏览器中访问：http://localhost:8080

## 五、默认登录信息

```
用户名: admin
密码:   admin
```

**⚠️ 安全提示**: 首次登录后，请立即修改默认密码！

## 六、常见问题

### 1. 数据库连接失败

**错误信息**: `❌ 数据库连接失败`

**解决方法**:
- 检查MySQL服务是否启动
- 验证 `.env` 文件中的数据库配置是否正确
- 确认数据库用户有访问权限

### 2. 端口被占用

**错误信息**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方法**:
- 修改 `.env` 文件中的 `PORT` 值
- 或者终止占用端口的进程

### 3. 前端无法访问后端API

**解决方法**:
- 确认后端服务已启动（默认端口3000）
- 检查 `frontend/vue.config.js` 中的代理配置
- 清除浏览器缓存，重新启动前端服务

### 4. 图片上传失败

**解决方法**:
- 确保 `uploads` 目录有写入权限
- 检查上传文件大小是否超过限制（默认5MB）
- 确认文件类型是否为图片格式

### 5. npm install 很慢

**解决方法**:
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
```

## 七、生产环境部署

### 1. 构建前端

```bash
cd frontend
npm run build
```

构建完成后，文件会输出到 `public` 目录。

### 2. 配置生产环境变量

修改 `.env` 文件：

```env
NODE_ENV=production
```

### 3. 使用PM2管理进程（推荐）

安装PM2：
```bash
npm install -g pm2
```

启动服务：
```bash
pm2 start server.js --name mall-admin
pm2 save
pm2 startup
```

查看日志：
```bash
pm2 logs mall-admin
```

### 4. 使用Nginx反向代理（可选）

示例Nginx配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 八、项目目录说明

```
mall-admin/
├── backend/              # 后端源码
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   └── utils/           # 工具函数
├── frontend/            # 前端源码
│   ├── public/          # 静态资源
│   └── src/             # 源代码
│       ├── api/         # API接口
│       ├── components/  # 组件
│       ├── router/      # 路由配置
│       ├── store/       # 状态管理
│       ├── styles/      # 样式
│       ├── utils/       # 工具函数
│       └── views/       # 页面
├── uploads/             # 上传文件目录
├── server.js            # 服务器入口
├── package.json         # 依赖配置
└── .env                 # 环境变量
```

## 九、功能清单

### 已实现功能

✅ 管理员登录/登出  
✅ 仪表盘数据统计  
✅ 商品管理（列表、新增、编辑、删除、上下架）  
✅ 分类管理（列表、新增、编辑、删除）  
✅ 轮播图管理（列表、新增、编辑、删除、上下架）  
✅ 订单管理（列表、详情、发货、关闭）  
✅ 用户管理（列表、详情、状态管理）  
✅ 图片上传  
✅ 权限认证  
✅ 左侧树型菜单栏  

## 十、技术支持

如有问题，请：
1. 检查本文档的常见问题章节
2. 查看项目 README.md 文件
3. 查看控制台日志定位问题

## 十一、安全建议

1. **修改默认密码**: 首次登录后立即修改管理员密码
2. **JWT密钥**: 使用强随机字符串作为JWT密钥
3. **数据库密码**: 使用复杂的数据库密码
4. **HTTPS**: 生产环境使用HTTPS协议
5. **防火墙**: 配置防火墙规则，只开放必要端口
6. **定期备份**: 定期备份数据库
7. **更新依赖**: 定期更新依赖包到最新版本

---

祝您使用愉快！🎉
