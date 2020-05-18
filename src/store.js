import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    clearAuth (state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    signup ({commit}, authData) {
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAv71t6_6YOyOdpbkmsvqtE2i68uhL3U1g', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
           localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
        
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    login ({commit}, authData) {
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAv71t6_6YOyOdpbkmsvqtE2i68uhL3U1g', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    logout ({commit}) {
      commit('clearAuth')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      router.replace('/')
    },
    AutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const userId = localStorage.getItem('userId')
      commit('authUser', {
        token: token,
        userId: userId
      })
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    ifAuthenticated (state) {
      return state.idToken !== null
    }
  }
})
