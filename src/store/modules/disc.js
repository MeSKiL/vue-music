import { SET_DISC } from '../mutation-types'

const disc = {
  namespaced: true,
  state: {
    disc: {}
  },
  mutations: {
    [SET_DISC] (state, disc) {
      state.disc = disc
    }
  },
  getters: {
    disc: (state) => state.disc
  }
}

export default disc
