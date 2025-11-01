import request from './index'

export const userApi = {
  getList(params) {
    return request({
      url: '/admin/user/list',
      method: 'get',
      params
    })
  },
  getDetail(id) {
    return request({
      url: `/admin/user/detail/${id}`,
      method: 'get'
    })
  },
  toggleStatus(id) {
    return request({
      url: `/admin/user/toggle-status/${id}`,
      method: 'post'
    })
  }
}
