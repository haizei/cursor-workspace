import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: '/admin',
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;

    // 如果返回的code不是200，则判断为错误
    if (res.code && res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      });

      // 401: 未授权，跳转到登录页
      if (res.code === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }

      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  error => {
    console.error('响应错误:', error);
    
    let message = '请求失败';
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          localStorage.removeItem('token');
          router.push('/login');
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求地址不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = error.response.data?.message || '请求失败';
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时';
    } else if (error.message.includes('Network Error')) {
      message = '网络错误';
    }

    Message({
      message,
      type: 'error',
      duration: 3000
    });

    return Promise.reject(error);
  }
);

export default service;
