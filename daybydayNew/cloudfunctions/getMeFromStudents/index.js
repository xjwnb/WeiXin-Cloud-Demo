// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const studentCollection = db.collection('ddd_students')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { OPENID } = wxContext

  try {
    return await studentCollection.where({
      _openid: OPENID
    }).get()
  } catch(e) {
    return e
  }
}