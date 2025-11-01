import request from '@/utils/request';

/**
 * 获取分类列表
 */
export function getCategoryList(params) {
  return request({
    url: '/admin/category/list',
    method: 'get',
    params
  });
}

/**
 * 获取所有分类（不分页）
 */
export function getAllCategories() {
  return request({
    url: '/admin/category/all',
    method: 'get'
  });
}

/**
 * 获取分类详情
 */
export function getCategoryDetail(id) {
  return request({
    url: `/admin/category/detail/${id}`,
    method: 'get'
  });
}

/**
 * 保存分类（新增/编辑）
 */
export function saveCategory(data) {
  return request({
    url: '/admin/category/save',
    method: 'post',
    data
  });
}

/**
 * 删除分类
 */
export function deleteCategory(id) {
  return request({
    url: `/admin/category/delete/${id}`,
    method: 'delete'
  });
}
