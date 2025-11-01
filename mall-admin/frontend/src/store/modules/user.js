import { login, getInfo, logout } from '@/api/auth';
import { getToken, setToken, removeToken } from '@/utils/auth';

const state = {
  token: getToken(),
  userInfo: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  
  CLEAR_USER(state) {
    state.token = '';
    state.userInfo = null;
  }
};

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then(response => {
          const { token, admin } = response.data;
          
          commit('SET_TOKEN', token);
          commit('SET_USER_INFO', admin);
          setToken(token);
          
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  
  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(response => {
          const { data } = response;
          
          if (!data) {
            reject('获取用户信息失败，请重新登录');
          }
          
          commit('SET_USER_INFO', data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  
  // 退出登录
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          commit('CLEAR_USER');
          removeToken();
          resolve();
        })
        .catch(error => {
          commit('CLEAR_USER');
          removeToken();
          reject(error);
        });
    });
  },
  
  // 重置Token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_USER');
      removeToken();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
