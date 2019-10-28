import { SET_SEARCH_HISTORY } from '../mutation-types'
import { saveSearch, loadSearch, deleteSearch, clearSearch } from '@common/js/cache'

const search = {
  namespaced: true,
  state: {
    searchHistory: loadSearch()
  },
  mutations: {
    [SET_SEARCH_HISTORY] (state, history) {
      state.searchHistory = history
    }
  },
  getters: {
    searchHistory: (state) => state.searchHistory
  },
  actions: {
    saveSearchHistory ({ commit }, query) {
      commit(SET_SEARCH_HISTORY, saveSearch(query))
    },
    deleteSearchHistory ({ commit }, query) {
      commit(SET_SEARCH_HISTORY, deleteSearch(query))
    },
    clearSearchHistory ({ commit }) {
      commit(SET_SEARCH_HISTORY, clearSearch())
    }
  }
}

export default search
