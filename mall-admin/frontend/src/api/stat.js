import request from '../utils/request';

/**
 * 获取仪表盘数据
 */
export function getDashboard() {
  return request({
    url: '/stat/dashboard',
    method: 'get'
  });
}
