<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
  import MHeader from '@components/m-header/m-header'
  import Tab from '@components/tab/tab'

  export default {
    components: {
      MHeader, Tab
    },
    created () {
      if (sessionStorage.getItem('store')) {
        this.$store.replaceState(
          Object.assign(
            {},
            this.$store.state,
            JSON.parse(sessionStorage.getItem('store'))
          )
        )
      }
      // 在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      })
      window.addEventListener('pagehide', () => {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      })
    }
  }
</script>
<style lang="less">

</style>
