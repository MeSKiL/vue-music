import { commonParams } from './config'
import { getUid } from '@common/js/uid'
import axios from 'axios'
import { ERR_OK } from '@api/config'

const debug = process.env.NODE_ENV !== 'production'

export async function getSongsUrl (songs) {
  const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = genUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    let tryTime = 3

    async function request () {
      const res = await axios.post(url, {
        comm: data,
        url_mid: urlMid
      })
      const resData = res.data
      if (resData.code === ERR_OK) {
        let urlMid = resData.url_mid
        if (urlMid && urlMid.code === ERR_OK) {
          const info = urlMid.data.midurlinfo[0]
          if (info && info.purl) {
            resolve(resData)
          } else {
            retry()
          }
        } else {
          retry()
        }
      } else {
        retry()
      }
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function genUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}