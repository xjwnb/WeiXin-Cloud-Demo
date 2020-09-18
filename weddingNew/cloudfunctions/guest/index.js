// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xkctest-3p3ce'
})

let db = cloud.database()
let wedding = db.collection('wedding')
let res = ""

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(res)
  const { OPENID } = cloud.getWXContext()

  event.OPENID = OPENID
  console.log(event)
  res = await wedding.add({
    data: event
  })
  console.log(res)
  return res
}