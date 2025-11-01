/**
 * 表单验证规则
 */

// 验证手机号
export function validatePhone(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
}

// 验证密码
export function validatePassword(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入密码'));
  } else if (value.length < 6) {
    callback(new Error('密码长度不能少于6位'));
  } else {
    callback();
  }
}

// 验证价格
export function validatePrice(rule, value, callback) {
  if (!value && value !== 0) {
    callback(new Error('请输入价格'));
  } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    callback(new Error('请输入正确的价格格式'));
  } else if (parseFloat(value) < 0) {
    callback(new Error('价格不能为负数'));
  } else {
    callback();
  }
}

// 验证库存
export function validateStock(rule, value, callback) {
  if (!value && value !== 0) {
    callback(new Error('请输入库存'));
  } else if (!/^\d+$/.test(value)) {
    callback(new Error('库存必须是整数'));
  } else if (parseInt(value) < 0) {
    callback(new Error('库存不能为负数'));
  } else {
    callback();
  }
}
