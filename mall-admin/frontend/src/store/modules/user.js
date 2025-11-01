import { getToken, setToken, removeToken } from '@/utils/auth';
import { login, logout } from '@/api/auth';

const state = {
  token: getToken(),
  userInfo: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
    setToken(token);
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo;
  },
  CLEAR_USER(state) {
    state.token = '';
    state.userInfo = null;
    removeToken();
  }
};

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    try {
      const res = await login(loginForm);
      if (res.success) {
        commit('SET_TOKEN', res.data.token);
        commit('SET_USER_INFO', res.data.admin);
      }
      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  
  // 退出登录
  async logout({ commit }) {
    try {
      await logout();
    } catch (error) {
      console.error('退出登录失败:', error);
    } finally {
      commit('CLEAR_USER');
    }
  },
  
  // 设置用户信息
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
