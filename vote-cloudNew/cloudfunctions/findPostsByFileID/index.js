// 云函数入口文件
// 云函数 findPostByFileID
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const posts = db.collection('posts')

  let openid = wxContext.OPENID
  let {
    fileID
  } = event

  return await posts.where({
    fileID,
    openid
  }).get()
}
