import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@components/recommend/recommend'
import Singer from '@components/singer/singer'
import Search from '@components/search/search'
import Rank from '@components/rank/rank'
import SingerDetail from '@components/singer-detail/singer-detail'
import Disc from '@components/disc/disc'
import TopList from '@components/top-list/top-list'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          props: true,
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          props: true,
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          props: true,
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
