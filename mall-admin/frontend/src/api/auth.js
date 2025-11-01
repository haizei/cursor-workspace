import request from '@/utils/request';

/**
 * 管理员登录
 */
export function login(data) {
  return request({
    url: '/admin/auth/login',
    method: 'post',
    data
  });
}

/**
 * 管理员退出登录
 */
export function logout() {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  });
}

/**
 * 修改密码
 */
export function changePassword(data) {
  return request({
    url: '/admin/auth/changepwd',
    method: 'post',
    data
  });
}

/**
 * 获取管理员列表
 */
export function getAdminList(params) {
  return request({
    url: '/admin/auth/list',
    method: 'get',
    params
  });
}
