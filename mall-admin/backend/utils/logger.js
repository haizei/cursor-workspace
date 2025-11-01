const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 日志工具类
 */
class Logger {
  /**
   * 写入日志文件
   * @param {string} level - 日志级别
   * @param {string} message - 日志消息
   */
  static write(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    const filename = `${new Date().toISOString().split('T')[0]}.log`;
    const logPath = path.join(logDir, filename);
    
    fs.appendFileSync(logPath, logMessage);
    
    // 同时输出到控制台
    console.log(logMessage.trim());
  }

  static info(message) {
    this.write('INFO', message);
  }

  static error(message) {
    this.write('ERROR', message);
  }

  static warn(message) {
    this.write('WARN', message);
  }

  static debug(message) {
    this.write('DEBUG', message);
  }
}

module.exports = Logger;
