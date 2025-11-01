import request from './index'

export const orderApi = {
  getList(params) {
    return request({
      url: '/admin/order/list',
      method: 'get',
      params
    })
  },
  getDetail(id) {
    return request({
      url: `/admin/order/detail/${id}`,
      method: 'get'
    })
  },
  deliver(id) {
    return request({
      url: `/admin/order/deliver/${id}`,
      method: 'post'
    })
  },
  close(id) {
    return request({
      url: `/admin/order/close/${id}`,
      method: 'post'
    })
  }
}
