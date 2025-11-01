require('dotenv').config();

module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // 文件上传配置
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  
  // 分页配置
  pagination: {
    defaultPage: 1,
    defaultPageSize: 10,
    maxPageSize: 100
  }
};
