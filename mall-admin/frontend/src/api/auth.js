import request from '../utils/request';

/**
 * 登录
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

/**
 * 登出
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
}

/**
 * 获取管理员信息
 */
export function getInfo() {
  return request({
    url: '/auth/info',
    method: 'get'
  });
}

/**
 * 修改密码
 */
export function changePassword(data) {
  return request({
    url: '/auth/changepwd',
    method: 'post',
    data
  });
}
