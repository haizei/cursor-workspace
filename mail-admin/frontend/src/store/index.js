import { createStore } from 'vuex'

const user = {
  state: {
    token: localStorage.getItem('token') || '',
    admin: JSON.parse(localStorage.getItem('admin') || 'null')
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_ADMIN(state, admin) {
      state.admin = admin
      localStorage.setItem('admin', JSON.stringify(admin))
    },
    CLEAR_USER(state) {
      state.token = ''
      state.admin = null
      localStorage.removeItem('token')
      localStorage.removeItem('admin')
    }
  },
  actions: {
    login({ commit }, { token, admin }) {
      commit('SET_TOKEN', token)
      commit('SET_ADMIN', admin)
    },
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  }
}

export default createStore({
  modules: {
    user
  }
})
