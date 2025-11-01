import request from './index'

export const goodsApi = {
  getList(params) {
    return request({
      url: '/admin/goods/list',
      method: 'get',
      params
    })
  },
  getDetail(id) {
    return request({
      url: `/admin/goods/detail/${id}`,
      method: 'get'
    })
  },
  save(data) {
    return request({
      url: '/admin/goods/save',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `/admin/goods/save/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/goods/delete/${id}`,
      method: 'delete'
    })
  },
  batchOperation(data) {
    return request({
      url: '/admin/goods/batch',
      method: 'post',
      data
    })
  }
}
