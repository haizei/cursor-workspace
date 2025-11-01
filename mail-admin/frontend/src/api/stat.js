import request from './index'

export const statApi = {
  getDashboard() {
    return request({
      url: '/admin/stat/dashboard',
      method: 'get'
    })
  }
}
