import { login, logout, getInfo } from '../../api/auth';
import { getToken, setToken, removeToken, setUser, removeUser } from '../../utils/auth';

const state = {
  token: getToken(),
  user: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  }
};

const actions = {
  // 登录
  async login({ commit }, loginForm) {
    const { username, password } = loginForm;
    const response = await login({ username: username.trim(), password });
    
    const { token, admin } = response.data;
    commit('SET_TOKEN', token);
    commit('SET_USER', admin);
    setToken(token);
    setUser(admin);
    
    return response;
  },

  // 获取用户信息
  async getInfo({ commit }) {
    const response = await getInfo();
    const user = response.data;
    
    commit('SET_USER', user);
    setUser(user);
    
    return response;
  },

  // 登出
  async logout({ commit }) {
    await logout();
    commit('SET_TOKEN', '');
    commit('SET_USER', null);
    removeToken();
    removeUser();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
