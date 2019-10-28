import { playMode } from '@common/js/config'
import { shuffle } from '@common/js/util'
import {
  SET_CURRENT_INDEX,
  SET_FULL_SCREEN,
  SET_PLAY_MODE,
  SET_PLAYING_STATE,
  SET_PLAYLIST,
  SET_SEQUENCE_LIST,
  SET_PLAY_HISTORY
} from '../mutation-types'
import { savePlay, loadPlay } from '@common/js/cache'

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
    currentIndex: -1,
    playHistory: loadPlay()
  },
  getters: {
    playing: state => state.playing,
    fullScreen: state => state.fullScreen,
    playlist: state => state.playlist,
    sequenceList: state => state.sequenceList,
    mode: state => state.mode,
    currentIndex: state => state.currentIndex,
    currentSong: state => state.playlist[state.currentIndex] || {},
    playHistory: state => state.playHistory
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
    },
    [SET_PLAY_HISTORY] (state, history) {
      state.playHistory = history
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
    },
    savePlayHistory ({ commit }, song) {
      commit(SET_PLAY_HISTORY, savePlay(song))
    },
    insertSong ({ commit, state }, song) {
      let playlist = [].concat(state.playlist)
      let sequenceList = [].concat(state.sequenceList)
      let currentIndex = state.currentIndex
      let currentSong = playlist[currentIndex]
      // 如果列表中有，就删除这首歌
      let fpIndex = findIndex(playlist, song)
      currentIndex++
      playlist.splice(currentIndex, 0, song)
      //
      if (fpIndex > -1) {
        if (currentIndex > fpIndex) {
          playlist.splice(fpIndex, 1)
          currentIndex--
        } else {
          playlist.splice(fpIndex + 1, 1)
        }
      }

      let currentSIndex = findIndex(sequenceList, currentSong) + 1
      let fsIndex = findIndex(sequenceList, song)
      sequenceList.splice(currentSIndex, 0, song)
      if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
          sequenceList.splice(fsIndex, 1)
        } else {
          sequenceList.splice(fsIndex + 1, 1)
        }
      }
      commit(SET_PLAYLIST, playlist)
      commit(SET_SEQUENCE_LIST, sequenceList)
      commit(SET_CURRENT_INDEX, currentIndex)
      commit(SET_FULL_SCREEN, true)
      commit(SET_PLAYING_STATE, true)
    },
    deleteSong ({ commit, state }, song) {
      let playlist = [].concat(state.playlist)
      let sequenceList = [].concat(state.sequenceList)
      let currentIndex = state.currentIndex
      let pIndex = findIndex(playlist, song)
      playlist.splice(pIndex, 1)
      let sIndex = findIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)
      if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
      }
      commit(SET_PLAYLIST, playlist)
      commit(SET_SEQUENCE_LIST, sequenceList)
      commit(SET_CURRENT_INDEX, currentIndex)

      const playingState = playlist.length > 0
      commit(SET_PLAYING_STATE, playingState)
    },

    deleteSongList ({ commit }) {
      commit(SET_PLAYLIST, [])
      commit(SET_SEQUENCE_LIST, [])
      commit(SET_CURRENT_INDEX, -1)
      commit(SET_PLAYING_STATE, false)
    }
  }
}

export default play
