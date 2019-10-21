import Vue from 'vue'
import Vuex from 'vuex'
import singer from './modules/singer'
import play from './modules/play'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    singer,
    play
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
