import request from '@/utils/request';

// 获取仪表盘统计数据
export function getDashboardData() {
  return request({
    url: '/stat/dashboard',
    method: 'get'
  });
}
