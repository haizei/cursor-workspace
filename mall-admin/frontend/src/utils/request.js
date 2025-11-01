import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store';
import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加token
    const token = store.getters.token;
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
    
    // 如果返回的状态码不是200，则认为是错误
    if (res.code !== 200) {
      Message({
        message: res.message || '请求失败',
        type: 'error',
        duration: 3000
      });
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        store.dispatch('user/logout').then(() => {
          router.push('/login');
        });
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      return res;
    }
  },
  error => {
    console.error('响应错误:', error);
    
    let message = '网络错误，请稍后重试';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          store.dispatch('user/logout').then(() => {
            router.push('/login');
          });
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器错误';
          break;
        default:
          message = error.response.data.message || '请求失败';
      }
    }
    
    Message({
      message: message,
      type: 'error',
      duration: 3000
    });
    
    return Promise.reject(error);
  }
);

export default service;
