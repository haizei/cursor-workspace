import request from '@/utils/request';

/**
 * 获取订单列表
 */
export function getOrderList(params) {
  return request({
    url: '/admin/order/list',
    method: 'get',
    params
  });
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  return request({
    url: `/admin/order/detail/${id}`,
    method: 'get'
  });
}

/**
 * 订单发货
 */
export function deliverOrder(data) {
  return request({
    url: '/admin/order/deliver',
    method: 'post',
    data
  });
}

/**
 * 关闭/取消订单
 */
export function closeOrder(data) {
  return request({
    url: '/admin/order/close',
    method: 'post',
    data
  });
}
