import request from '@/utils/request';

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  });
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/order/detail/${id}`,
    method: 'get'
  });
}

// 发货
export function deliverOrder(data) {
  return request({
    url: '/order/deliver',
    method: 'post',
    data
  });
}

// 关闭订单
export function closeOrder(data) {
  return request({
    url: '/order/close',
    method: 'post',
    data
  });
}

// 导出订单
export function exportOrders(params) {
  return request({
    url: '/order/export',
    method: 'get',
    params
  });
}
