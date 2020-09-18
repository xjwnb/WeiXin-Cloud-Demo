// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  let {fileID} = event
  let openid = wxContext.OPENID
  const db = cloud.database()
  const candidate = db.collection('candidate')
  let vote = 0
  console.log(fileID, openid, vote)
  let res = await candidate.add({
    data: {
      fileID,openid,vote
    }
  })
  return res
}