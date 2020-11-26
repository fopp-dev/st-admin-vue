import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  userInfo: {
    phone: '',
    userInfo: ''
  },
  siteInfo: {
    siteLogo: '',
    siteName: ''
  },
  loginIsShow: false
}

export default new Vuex.Store({
  state
})
