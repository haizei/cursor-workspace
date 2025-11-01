-- ========================================
-- 商城小程序数据库建表语句
-- 数据库名：mall
-- ========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `mall` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `mall`;

-- ========================================
-- 1. 分类表（category）
-- ========================================
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '分类图片URL',
  `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父分类ID（0表示一级分类）',
  `sort` INT UNSIGNED DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（0=禁用，1=启用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品分类表';

-- ========================================
-- 2. 商品表（goods）
-- ========================================
CREATE TABLE IF NOT EXISTS `goods` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `main_image` VARCHAR(255) DEFAULT NULL COMMENT '商品主图URL',
  `images` TEXT COMMENT '商品轮播图片URL列表（JSON格式存储多个图片）',
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '商品价格',
  `stock` INT UNSIGNED DEFAULT 0 COMMENT '商品库存',
  `category_id` INT UNSIGNED NOT NULL COMMENT '分类ID',
  `description` TEXT COMMENT '商品描述',
  `detail` LONGTEXT COMMENT '商品详情（富文本）',
  `sort` INT UNSIGNED DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '上架状态（0=下架，1=上架）',
  `is_recommend` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否推荐（0=否，1=是）',
  `recommend_sort` INT UNSIGNED DEFAULT 0 COMMENT '推荐排序（数字越小越靠前）',
  `sales` INT UNSIGNED DEFAULT 0 COMMENT '销量',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_recommend` (`is_recommend`),
  KEY `idx_recommend_sort` (`recommend_sort`),
  KEY `idx_sort` (`sort`),
  CONSTRAINT `fk_goods_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- ========================================
-- 3. 轮播图表（banner）
-- ========================================
CREATE TABLE IF NOT EXISTS `banner` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '轮播图ID',
  `name` VARCHAR(100) DEFAULT NULL COMMENT '轮播图名称',
  `image` VARCHAR(255) NOT NULL COMMENT '轮播图片URL',
  `link` VARCHAR(255) DEFAULT NULL COMMENT '跳转链接（可以是商品ID或外部链接）',
  `link_type` TINYINT UNSIGNED DEFAULT 1 COMMENT '链接类型（1=商品详情，2=外部链接）',
  `sort` INT UNSIGNED DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（0=下架，1=上架）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图表';

-- ========================================
-- 4. 用户表（user）
-- ========================================
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` VARCHAR(100) NOT NULL COMMENT '微信OpenID（唯一标识）',
  `unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信UnionID（可选）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '用户昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '用户头像URL',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `gender` TINYINT UNSIGNED DEFAULT 0 COMMENT '性别（0=未知，1=男，2=女）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（0=禁用，1=启用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ========================================
-- 5. 收货地址表（address）
-- ========================================
CREATE TABLE IF NOT EXISTS `address` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `receiver_name` VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` VARCHAR(20) NOT NULL COMMENT '收货人电话',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
  `detail` VARCHAR(200) NOT NULL COMMENT '详细地址',
  `postal_code` VARCHAR(10) DEFAULT NULL COMMENT '邮编',
  `is_default` TINYINT UNSIGNED DEFAULT 0 COMMENT '是否默认地址（0=否，1=是）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_default` (`is_default`),
  CONSTRAINT `fk_address_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收货地址表';

-- ========================================
-- 6. 购物车表（cart）
-- ========================================
CREATE TABLE IF NOT EXISTS `cart` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `goods_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `count` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '商品数量',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_goods` (`user_id`, `goods_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_goods_id` (`goods_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_goods` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- ========================================
-- 7. 订单表（order）
-- ========================================
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号（唯一）',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `total_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '订单总金额',
  `status` TINYINT UNSIGNED DEFAULT 0 COMMENT '订单状态（0=待支付，1=待发货，2=已发货，3=已完成，4=已关闭）',
  `receiver_name` VARCHAR(50) NOT NULL COMMENT '收货人姓名',
  `receiver_phone` VARCHAR(20) NOT NULL COMMENT '收货人电话',
  `receiver_address` VARCHAR(500) NOT NULL COMMENT '收货地址（完整地址）',
  `remark` VARCHAR(500) DEFAULT NULL COMMENT '订单备注',
  `pay_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `deliver_time` DATETIME DEFAULT NULL COMMENT '发货时间',
  `finish_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ========================================
-- 8. 订单商品表（order_item）
-- ========================================
CREATE TABLE IF NOT EXISTS `order_item` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单商品ID',
  `order_id` INT UNSIGNED NOT NULL COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号（冗余字段，便于查询）',
  `goods_id` INT UNSIGNED NOT NULL COMMENT '商品ID',
  `goods_name` VARCHAR(200) NOT NULL COMMENT '商品名称（冗余字段，商品可能被删除）',
  `goods_image` VARCHAR(255) DEFAULT NULL COMMENT '商品图片（冗余字段）',
  `goods_price` DECIMAL(10, 2) NOT NULL COMMENT '商品单价（冗余字段，价格可能变动）',
  `count` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '商品数量',
  `total_price` DECIMAL(10, 2) NOT NULL COMMENT '商品总价',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_order_no` (`order_no`),
  KEY `idx_goods_id` (`goods_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_item_goods` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单商品表';

-- ========================================
-- 9. 管理员表（admin）
-- ========================================
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` VARCHAR(50) NOT NULL COMMENT '管理员账号',
  `password` VARCHAR(255) NOT NULL COMMENT '管理员密码（加密后存储）',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '管理员昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '管理员头像',
  `permissions` TEXT COMMENT '权限列表（JSON格式存储）',
  `status` TINYINT UNSIGNED DEFAULT 1 COMMENT '状态（0=禁用，1=启用）',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ========================================
-- 插入初始数据
-- ========================================

-- 插入默认管理员账号（用户名：admin，密码：admin）
-- 注意：此处按需求直接存储明文密码 'admin'
-- ⚠️ 安全提示：生产环境强烈建议使用 bcrypt 等加密方式加密密码！
-- 如果后端使用加密，建议在代码中重新加密并更新：
--    const bcrypt = require('bcrypt');
--    const hashedPassword = await bcrypt.hash('admin', 10);
--    UPDATE admin SET password = ? WHERE username = 'admin';
INSERT INTO `admin` (`username`, `password`, `nickname`, `status`, `create_time`) 
VALUES ('admin', 'admin', '管理员', 1, NOW())
ON DUPLICATE KEY UPDATE `username` = `username`;

-- ========================================
-- 创建索引优化（可选，已在表创建时添加主要索引）
-- ========================================

-- ========================================
-- 建表完成说明
-- ========================================
-- 
-- 注意事项：
-- 1. 管理员密码使用 MD5 加密，实际生产环境应使用 bcrypt 等更安全的加密方式
-- 2. 在 Node.js 后端中，建议使用 bcrypt 重新加密管理员密码：
--    const bcrypt = require('bcrypt');
--    const hashedPassword = await bcrypt.hash('admin', 10);
--    然后将 hashedPassword 存入数据库
-- 
-- 3. 订单状态说明：
--    0 = 待支付
--    1 = 待发货
--    2 = 已发货
--    3 = 已完成
--    4 = 已关闭
-- 
-- 4. 商品状态说明：
--    0 = 下架
--    1 = 上架
-- 
-- 5. 用户/管理员状态说明：
--    0 = 禁用
--    1 = 启用
-- 
-- ========================================

