import { playMode } from '@common/js/config'
import { shuffle } from '@common/js/util'
import {
  SET_CURRENT_INDEX,
  SET_FULL_SCREEN,
  SET_PLAY_MODE,
  SET_PLAYING_STATE,
  SET_PLAYLIST,
  SET_SEQUENCE_LIST
} from '../mutation-types'

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

const play = {
  namespaced: true,
  state: {
    playing: false, // 正在播放
    fullScreen: false, // 全屏
    playlist: [], // 播放列表
    sequenceList: [], // 展示列表
    mode: playMode.sequence,
    currentIndex: -1
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playlist: state => state.playlist,
    sequenceList: state => state.sequenceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.playlist[state.currentIndex] || {}
  },
  mutations: {
    [SET_PLAYING_STATE] (state, flag) {
      state.playing = flag
    },
    [SET_FULL_SCREEN] (state, flag) {
      state.fullScreen = flag
    },
    [SET_PLAYLIST] (state, list) {
      state.playlist = list
    },
    [SET_SEQUENCE_LIST] (state, list) {
      state.sequenceList = list
    },
    [SET_PLAY_MODE] (state, mode) {
      state.mode = mode
    },
    [SET_CURRENT_INDEX] (state, index) {
      state.currentIndex = index
    }
  },
  actions: {
    selectPlay ({ commit, state }, { list, index }) {
      commit(SET_SEQUENCE_LIST, list)
      if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
      } else {
        commit(SET_PLAYLIST, list)
      }
      commit(SET_CURRENT_INDEX, index)
      commit(SET_FULL_SCREEN, true)
      commit(SET_PLAYING_STATE, true)
    },
    randomPlay ({ commit }, { list }) {
      commit(SET_PLAY_MODE, playMode.random)
      commit(SET_SEQUENCE_LIST, list)
      commit(SET_PLAYLIST, shuffle(list))
      commit(SET_CURRENT_INDEX, 0)
      commit(SET_FULL_SCREEN, true)
      commit(SET_PLAYING_STATE, true)
    }
  }
}

export default play
