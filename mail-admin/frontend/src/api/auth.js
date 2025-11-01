import request from './index'

export const authApi = {
  login(data) {
    return request({
      url: '/admin/auth/login',
      method: 'post',
      data
    })
  },
  getInfo() {
    return request({
      url: '/admin/auth/info',
      method: 'get'
    })
  },
  changePassword(data) {
    return request({
      url: '/admin/auth/change-password',
      method: 'post',
      data
    })
  }
}
