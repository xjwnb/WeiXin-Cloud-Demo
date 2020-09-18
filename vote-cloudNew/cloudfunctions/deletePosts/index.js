// 云函数入口文件
// 云函数 deletePosts
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const posts = db.collection('posts')
  const candidate = db.collection('candidate')
  const _ = db.command

  let {
    fileID
  } = event
  let openid = wxContext.OPENID
  try {
    await posts.where({
      openid,
      fileID
    }).remove()
    return await candidate.where({
      openid,
      fileID
    }).update({
      data: {
        vote: _.inc(-1)
      }
    })
  } catch (e) {
    console.log(e)
  }

}