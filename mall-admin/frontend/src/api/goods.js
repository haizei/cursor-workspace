import request from '@/utils/request';

/**
 * 获取商品列表
 */
export function getGoodsList(params) {
  return request({
    url: '/admin/goods/list',
    method: 'get',
    params
  });
}

/**
 * 获取商品详情
 */
export function getGoodsDetail(id) {
  return request({
    url: `/admin/goods/detail/${id}`,
    method: 'get'
  });
}

/**
 * 保存商品（新增/编辑）
 */
export function saveGoods(data) {
  return request({
    url: '/admin/goods/save',
    method: 'post',
    data
  });
}

/**
 * 删除商品
 */
export function deleteGoods(id) {
  return request({
    url: `/admin/goods/delete/${id}`,
    method: 'delete'
  });
}

/**
 * 设置商品状态
 */
export function setGoodsStatus(data) {
  return request({
    url: '/admin/goods/setstatus',
    method: 'post',
    data
  });
}
