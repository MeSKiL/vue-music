<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
  import MusicList from '@components/music-list/music-list'
  import { createNamespacedHelpers } from 'vuex'
  import { getMusicList } from '@api/rank'
  import { ERR_OK } from '@api/config'
  import { createSong, isValidMusic, processSongsUrl } from '@common/js/song'

  const {
    mapGetters
  } = createNamespacedHelpers('topList')
  export default {
    props: ['id'],
    components: {
      MusicList
    },
    computed: {
      ...mapGetters(['topList']),
      title () {
        return this.topList.topTitle
      },
      bgImage () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    created () {
      this._getMusicList()
    },
    data () {
      return {
        songs: [],
        rank: true
      }
    },
    methods: {
      _getMusicList () {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="less">
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
