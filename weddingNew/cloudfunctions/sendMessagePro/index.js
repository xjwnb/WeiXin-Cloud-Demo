// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')

cloud.init({
  env: 'xkctest-3p3ce'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.getCategory({})
    let ids = result.data.map(item => {
      return item.id
    })

    ids = ids.toString()
    console.log(ids)
    console.log(typeof ids)

    let results = await cloud.openapi.subscribeMessage.getPubTemplateTitleList({
      ids,
      start: 1,
      limit: 2
    })
    console.log(results.data[0].tid)
    console.log(results.data[1].tid)
    let tid = [results.data[0].tid, results.data[1].tid]


    let getPubTemplate = await results.data.map(async item => {
      return await cloud.openapi.subscribeMessage.getPubTemplateKeyWordsById({
        tid: item.tid.toString()
      })
    })
    console.log(getPubTemplate)
    // getPubTemplate 是 Promise 数组
    let data = await Promise.all(getPubTemplate)
    console.log(data)
    let newData = data.map(item => {

      if (item.data.length > 0) {
        return item.data.splice(0,5)
      }
      return item.data
    })
    let result1 = {
      tid,
      data: newData
    }

    console.log(newData)
    let appid = 'wx65c88c49f4fe7797'
    let APPSECRET = '7a989f6b2437112858df6f54899680e6'
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${APPSECRET}`
    let access_token = got(url)
    console.log(access_token)
    /*     let data 
        await getPubTemplate[0].then(res => {
          data = res.data
        })
        console.log(data.splice(0,2))

        // data = data.splice(0,2)
        console.log(data)

        let getKidAndRule = data.map(item => {
          return {
            kid: item.kid,
            rule: item.rule
          }
        })
        console.log(getKidAndRule) */

    return result1
  } catch (e) {
    return e
  }
}