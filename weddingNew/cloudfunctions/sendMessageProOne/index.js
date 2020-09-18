// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xkctest-3p3ce'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let {
    id
  } = event
  try {
    result = typeof id
    /* const result = await cloud.openapi.subscribeMessage.getPubTemplateKeyWordsById({
      tid: id
    })
    console.log(result) */
    return result
  } catch (e) {
    return e
  }

}