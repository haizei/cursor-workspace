import request from './index'

export const categoryApi = {
  getList(params) {
    return request({
      url: '/admin/category/list',
      method: 'get',
      params
    })
  },
  getDetail(id) {
    return request({
      url: `/admin/category/detail/${id}`,
      method: 'get'
    })
  },
  save(data) {
    return request({
      url: '/admin/category/save',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `/admin/category/save/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/category/delete/${id}`,
      method: 'delete'
    })
  }
}
