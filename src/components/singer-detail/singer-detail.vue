<template>
  <transition name="slide" appear>
    <music-list :songs="songs" :bg-image="bgImage" :title="title" />
  </transition>
</template>

<script>
  import {
    createNamespacedHelpers
  } from 'vuex'
  import { getSingerDetail } from '@api/singer'
  import { ERR_OK } from '@api/config'
  import { createSong, processSongsUrl, isValidMusic } from '@common/js/song'
  import MusicList from '@components/music-list/music-list'

  const {
    mapGetters
  } = createNamespacedHelpers('singer')
  export default {
    props: ['id'],
    components: {
      MusicList
    },
    created () {
      this._getDetail()
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      async _getDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
        }

        const res = await getSingerDetail(this.singer.id)
        if (res.code === ERR_OK) {
          this.songs = await processSongsUrl(this._normalizeSongs(res.data.list))
          console.log(this.songs)
        }
      },
      _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let { musicData } = item
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
  @import '~@common/style/variable';

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
