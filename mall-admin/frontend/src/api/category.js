import request from '@/utils/request';

// 获取分类列表
export function getCategoryList(params) {
  return request({
    url: '/category/list',
    method: 'get',
    params
  });
}

// 获取分类详情
export function getCategoryDetail(id) {
  return request({
    url: `/category/detail/${id}`,
    method: 'get'
  });
}

// 保存分类
export function saveCategory(data) {
  return request({
    url: '/category/save',
    method: 'post',
    data
  });
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/category/delete/${id}`,
    method: 'delete'
  });
}
