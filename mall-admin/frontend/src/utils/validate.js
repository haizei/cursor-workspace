/**
 * 验证工具函数
 */

/**
 * 验证手机号
 */
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 验证邮箱
 */
export function isValidEmail(email) {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
}

/**
 * 验证URL
 */
export function isValidURL(url) {
  return /^(https?:\/\/)/.test(url);
}

/**
 * 验证数字
 */
export function isNumber(value) {
  return /^\d+(\.\d+)?$/.test(value);
}

/**
 * 验证整数
 */
export function isInteger(value) {
  return /^\d+$/.test(value);
}

/**
 * 验证价格（保留两位小数）
 */
export function isValidPrice(price) {
  return /^\d+(\.\d{1,2})?$/.test(price);
}
