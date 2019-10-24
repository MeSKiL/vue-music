<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from '@components/music-list/music-list'
  import { getSongList } from '@api/recommend'
  import { ERR_OK } from '@api/config'
  import { createSong, isValidMusic, processSongsUrl } from '@common/js/song'
  import { createNamespacedHelpers } from 'vuex'

  const {
    mapGetters
  } = createNamespacedHelpers('topList')
  export default {
    props: ['id'],
    components: {
      MusicList
    },
    created () {
      this._getSongList()
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title () {
        return this.disc.dissname
      },
      bgImage () {
        return this.disc.imgurl
      }
    },
    mounted () {
      console.log('id', this.id)
    },
    methods: {
      _getSongList () {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
            })
          }
        })
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((musicData) => {
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
    transition: all 0.3s;
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
