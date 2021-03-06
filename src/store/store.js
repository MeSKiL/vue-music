import Vue from 'vue'
import Vuex from 'vuex'
import singer from './modules/singer'
import play from './modules/play'
import disc from './modules/disc'
import topList from './modules/topList'
import search from './modules/search'
import favorite from './modules/favorite'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    singer,
    play,
    disc,
    topList,
    search,
    favorite
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
