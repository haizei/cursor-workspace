import request from '../utils/request';

/**
 * 获取订单列表
 */
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  });
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id) {
  return request({
    url: `/order/detail/${id}`,
    method: 'get'
  });
}

/**
 * 订单发货
 */
export function deliverOrder(id) {
  return request({
    url: '/order/deliver',
    method: 'post',
    data: { id }
  });
}

/**
 * 关闭订单
 */
export function closeOrder(id) {
  return request({
    url: '/order/close',
    method: 'post',
    data: { id }
  });
}
