import request from './index'

export const uploadApi = {
  uploadImage(file, type = 'common') {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url: `/admin/upload/image?type=${type}`,
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
