import {
  createNamespacedHelpers
} from 'vuex'
import { playMode } from '@common/js/config'
import { shuffle } from '@common/js/util'

const {
  mapGetters, mapMutations
} = createNamespacedHelpers('play')

const searchMapGetters = createNamespacedHelpers('search').mapGetters
const searchMapActions = createNamespacedHelpers('search').mapActions

const favoriteMapGetters = createNamespacedHelpers('favorite').mapGetters
const favoriteMapActions = createNamespacedHelpers('favorite').mapActions
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  methods: {
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method') // 模板方法模式 抽象类
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playlist',
      'playing'
    ]),
    ...favoriteMapGetters([
      'favoriteList'
    ]),
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...favoriteMapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    }
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...searchMapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...searchMapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ]),
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      this.query = query
    },
    deleteOne (item) {
      this.deleteSearchHistory(item)
    }
  }
}
