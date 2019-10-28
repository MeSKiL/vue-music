import { SET_FAVORITE_LIST } from '../mutation-types'
import { saveFavorite, deleteFavorite, loadFavorite } from '@common/js/cache'

const favorite = {
  namespaced: true,
  state: {
    favoriteList: loadFavorite()
  },
  mutations: {
    [SET_FAVORITE_LIST] (state, favoriteList) {
      state.favoriteList = favoriteList
    }
  },
  getters: {
    favoriteList: (state) => state.favoriteList
  },
  actions: {
    saveFavoriteList ({ commit }, song) {
      commit(SET_FAVORITE_LIST, saveFavorite(song))
    },
    deleteFavoriteList ({ commit }, song) {
      commit(SET_FAVORITE_LIST, deleteFavorite(song))
    }
  }
}

export default favorite
