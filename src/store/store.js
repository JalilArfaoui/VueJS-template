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
    client: null,
    secondLevel: null
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
    },
    setSL (state, secondLevel) {
      state.secondLevel = secondLevel
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
    },
    setSL ({ commit }, secondLevel) {
      commit('setSL', secondLevel)
    }
  },
  getters: {
    // getUser: (state) => { return state.user }
    getToken: token => {
      return token
    },
    getClient: client => {
      return client
    },
    getSL: secondLevel => {
      return secondLevel
    }
  }
})
