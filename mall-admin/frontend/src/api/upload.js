import axios from 'axios';
import { Message } from 'element-ui';

/**
 * 上传单张图片
 */
export function uploadImage(file, type = 'goods') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const token = localStorage.getItem('token');

  return axios.post('/admin/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
    if (res.data.code === 200) {
      return res.data.data;
    } else {
      Message.error(res.data.message || '上传失败');
      return Promise.reject(new Error(res.data.message));
    }
  }).catch(err => {
    Message.error('上传失败');
    return Promise.reject(err);
  });
}

/**
 * 上传多张图片
 */
export function uploadImages(files, type = 'goods') {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('type', type);

  const token = localStorage.getItem('token');

  return axios.post('/admin/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
    if (res.data.code === 200) {
      return res.data.data;
    } else {
      Message.error(res.data.message || '上传失败');
      return Promise.reject(new Error(res.data.message));
    }
  }).catch(err => {
    Message.error('上传失败');
    return Promise.reject(err);
  });
}
