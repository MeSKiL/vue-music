<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list" />
    <router-view />
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from '@api/singer'
  import { ERR_OK } from '@api/config'
  import Singer from '@common/js/singer'
  import ListView from '@base/listview/listview'
  import { createNamespacedHelpers } from 'vuex'
  import { playlistMixin } from '@common/js/mixin'

  const {
    mapMutations
  } = createNamespacedHelpers('singer')

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playlistMixin],
    components: {
      ListView
    },
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      handlePlaylist (playlist) {
        this.$refs.singer.style.bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.refresh()
      },
      selectSinger (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger (list, index) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          let singer = new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(singer)
          }
          let key = item.Findex
          if (map[key]) {
            map[key].items.push(singer)
          } else {
            map[key] = {
              items: [singer],
              title: key
            }
          }
        })
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val) // hot其实就一项
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return [...hot, ...ret]
      }
    }
  }
</script>

<style scoped lang="less">
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>
