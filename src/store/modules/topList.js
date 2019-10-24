import { SET_TOP_LIST } from '../mutation-types'

const topList = {
  namespaced: true,
  state: {
    topList: {}
  },
  mutations: {
    [SET_TOP_LIST] (state, topList) {
      state.topList = topList
    }
  },
  getters: {
    topList: (state) => state.topList
  }
}

export default topList
