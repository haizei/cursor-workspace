import request from '@/utils/request';

/**
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  });
}

/**
 * 获取用户详情
 */
export function getUserDetail(id) {
  return request({
    url: `/admin/user/detail/${id}`,
    method: 'get'
  });
}

/**
 * 设置用户状态
 */
export function setUserStatus(data) {
  return request({
    url: '/admin/user/setstatus',
    method: 'post',
    data
  });
}
