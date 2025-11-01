const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

class Logger {
  static log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    // 输出到控制台
    console.log(logMessage.trim());
    
    // 写入日志文件
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage);
  }

  static info(message) {
    this.log(message, 'info');
  }

  static error(message) {
    this.log(message, 'error');
  }

  static warn(message) {
    this.log(message, 'warn');
  }

  static debug(message) {
    this.log(message, 'debug');
  }
}

module.exports = Logger;
