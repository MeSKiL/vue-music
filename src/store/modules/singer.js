import { SET_SINGER } from '../mutation-types'

const singer = {
  namespaced: true,
  state: {
    singer: {}
  },
  mutations: {
    [SET_SINGER] (state, singer) {
      state.singer = singer
    }
  },
  getters: {
    singer: (state) => state.singer
  }
}

export default singer
