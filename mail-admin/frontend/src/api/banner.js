import request from './index'

export const bannerApi = {
  getList(params) {
    return request({
      url: '/admin/banner/list',
      method: 'get',
      params
    })
  },
  getDetail(id) {
    return request({
      url: `/admin/banner/detail/${id}`,
      method: 'get'
    })
  },
  save(data) {
    return request({
      url: '/admin/banner/save',
      method: 'post',
      data
    })
  },
  update(id, data) {
    return request({
      url: `/admin/banner/save/${id}`,
      method: 'put',
      data
    })
  },
  delete(id) {
    return request({
      url: `/admin/banner/delete/${id}`,
      method: 'delete'
    })
  }
}
