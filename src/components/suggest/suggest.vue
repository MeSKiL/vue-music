<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result" :key="item.id">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import { search } from '@api/search'
  import { ERR_OK } from '@api/config'
  import { createSong, isValidMusic, processSongsUrl } from '@common/js/song'
  import Scroll from '@base/scroll/scroll'
  import Loading from '@base/loading/loading'
  import Singer from '@common/js/singer'
  import NoResult from '@base/no-result/no-result'
  import { createNamespacedHelpers } from 'vuex'

  const {
    mapMutations
  } = createNamespacedHelpers('singer')
  const {
    mapActions
  } = createNamespacedHelpers('play')
  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    components: {
      Scroll, Loading, NoResult
    },
    watch: {
      query () {
        this.search()
      }
    },
    data () {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      search () {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then(res => {
              this.result = res
            })
            this._checkMore(res.data)
          }
        })
      },
      searchMore () {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then(res => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then(res => {
              this.result = this.result.concat(res)
            })
            this._checkMore(res.data)
          }
        })
      },
      getIconCls (item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName (item) {
        console.log(item)
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage >= song.totalnum)) {
          this.hasMore = false
        }
      },
      listScroll () {
        this.$emit('listScroll')
      },
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      refresh () {
        this.$refs.suggest.refresh()
      },
      _genResult (data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
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
  @import "~@common/style/variable";
  @import "~@common/style/mixin";

  .suggest {
    height: 100%;
    overflow: hidden;

    .suggest-list {
      padding: 0 30px;

      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          font-size: 14px;
          color: @color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;

        .text {
          .no-wrap()
        }
      }
    }

    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

</style>
