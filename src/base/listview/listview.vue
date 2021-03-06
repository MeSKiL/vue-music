<template>
  <Scroll ref="listview"
          class="listview"
          :data="data"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" :key="group.title" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar" alt="头像" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :data-index="index"
            :key="item"
            :class="{'current':currentIndex===index}"
        >{{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from '@base/scroll/scroll'
  import { getData } from '@common/js/dom'
  import Loading from '@base/loading/loading'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    components: {
      Scroll, Loading
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () { // 隐藏首个
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        const listHeight = this.listHeight
        if (newY >= 0) { // 当拉过最上方的时候，还是显示第一个
          this.currentIndex = 0
          return
        }

        // 在范围内滚动
        for (let i = 0, len = listHeight.length - 1; i < len; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if ((-newY) >= height1 && (-newY) < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }

        // 最后一个元素的位置（暂时认为没有必要，仅为语意与严谨）
        this.currentIndex = listHeight.length - 2
      },
      diff (newDiff) {
        let fixedTop = (newDiff > 0 && newDiff < TITLE_HEIGHT) ? newDiff - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3D(0,${fixedTop}px,0)`
      }
    },
    created () {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    methods: {
      selectItem (item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart (e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0] // 获取第一下手指的位置
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 向下取整
        let anchorIndex = this.touch.anchorIndex - 0 + delta
        this._scrollTo(anchorIndex)
      },
      refresh () {
        this.$refs.listview.refresh()
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _scrollTo (index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0) // 缓动函数的动画时间
      },
      _calculateHeight () {
        this.listHeight = [0]
        const list = this.$refs.listGroup
        let height = 0
        list.map(item => {
          height += item.clientHeight
          this.listHeight.push(height)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  @import "~@common/style/variable";

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;

    .list-group {
      padding-bottom: 30px;

      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background
      }

      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }

      }

    }

    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;

      .item {
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;

        &.current {
          color: @color-theme
        }
      }

    }

    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }

    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

  }

</style>
