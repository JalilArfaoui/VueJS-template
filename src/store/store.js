import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    token: null,
    user: null,
    isUserLoggedIn: false,
    isUserAdmin: false,
    client: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      state.isUserLoggedIn = !!(token)
    },
    setUser (state, user) {
      state.user = user
    },
    setClient (state, client) {
      state.client = client
    },
    setAdmin (state, user) {
      state.isUserAdmin = !!(user)
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', token)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    setClient ({ commit }, client) {
      commit('setClient', client)
    },
    setAdmin ({ commit }, user) {
      commit('setAdmin', user)
    }
  },
  getters: {
    // getUser: (state) => { return state.user }
    getToken: token => {
      return token
    },
    getClient: client => {
      return client
    }
  }
})
