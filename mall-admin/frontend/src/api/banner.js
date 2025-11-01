import request from '@/utils/request';

/**
 * 获取轮播图列表
 */
export function getBannerList(params) {
  return request({
    url: '/admin/banner/list',
    method: 'get',
    params
  });
}

/**
 * 获取轮播图详情
 */
export function getBannerDetail(id) {
  return request({
    url: `/admin/banner/detail/${id}`,
    method: 'get'
  });
}

/**
 * 保存轮播图（新增/编辑）
 */
export function saveBanner(data) {
  return request({
    url: '/admin/banner/save',
    method: 'post',
    data
  });
}

/**
 * 删除轮播图
 */
export function deleteBanner(id) {
  return request({
    url: `/admin/banner/delete/${id}`,
    method: 'delete'
  });
}

/**
 * 设置轮播图状态
 */
export function setBannerStatus(data) {
  return request({
    url: '/admin/banner/setstatus',
    method: 'post',
    data
  });
}
