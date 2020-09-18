// 云函数入口文件
// findImage 云函数
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const candidate = db.collection('candidate')

  let {
    fileID
  } = event
  let data = await candidate.where({
    fileID
  }).get()

  return data

}