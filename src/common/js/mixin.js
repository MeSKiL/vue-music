import {
  createNamespacedHelpers
} from 'vuex'

const {
  mapGetters
} = createNamespacedHelpers('play')
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
