import request from '../utils/request';

/**
 * 获取轮播图列表
 */
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  });
}

/**
 * 获取轮播图详情
 */
export function getBannerDetail(id) {
  return request({
    url: `/banner/detail/${id}`,
    method: 'get'
  });
}

/**
 * 保存轮播图（新增/编辑）
 */
export function saveBanner(data) {
  return request({
    url: '/banner/save',
    method: 'post',
    data
  });
}

/**
 * 删除轮播图
 */
export function deleteBanner(id) {
  return request({
    url: '/banner/delete',
    method: 'post',
    data: { id }
  });
}

/**
 * 设置轮播图状态
 */
export function setBannerStatus(id, status) {
  return request({
    url: '/banner/setstatus',
    method: 'post',
    data: { id, status }
  });
}
