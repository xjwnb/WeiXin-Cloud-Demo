// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xkctest-3p3ce'
})
let db = cloud.database()
let wedding = db.collection('wedding')
let res = ''

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let today = new Date()
  let offset = 8
  let utc = today.getTime() + (today.getTimezoneOffset() * 60000)
  today = new Date(utc + (3600000 * offset))
  today = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

  let messages = await wedding.where({
    "date3.value": today
  }).get()

  console.log(messages)
  let result = []
  for (v of messages.data) {
    res = await cloud.openapi.subscribeMessage.send({
      touser: v.OPENID,
      page: '/pages/index/index',
      data: v,
      templateId: v.templateID
    })
    console.log(v)
    console.log(res)
    result.push(res)
  }
  console.log(result)
  return result
}