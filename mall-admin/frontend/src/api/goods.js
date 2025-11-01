import request from '@/utils/request';

// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  });
}

// 获取商品详情
export function getGoodsDetail(id) {
  return request({
    url: `/goods/detail/${id}`,
    method: 'get'
  });
}

// 保存商品
export function saveGoods(data) {
  return request({
    url: '/goods/save',
    method: 'post',
    data
  });
}

// 删除商品
export function deleteGoods(id) {
  return request({
    url: `/goods/delete/${id}`,
    method: 'delete'
  });
}

// 批量删除商品
export function batchDeleteGoods(ids) {
  return request({
    url: '/goods/batch-delete',
    method: 'post',
    data: { ids }
  });
}

// 设置商品状态
export function setGoodsStatus(data) {
  return request({
    url: '/goods/setstatus',
    method: 'post',
    data
  });
}

// 批量设置商品状态
export function batchSetGoodsStatus(data) {
  return request({
    url: '/goods/batch-setstatus',
    method: 'post',
    data
  });
}
