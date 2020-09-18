// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const students = db.collection('ddd_students')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    let count = await students.aggregate()
      .sort({
        score: 1
      })
      .end()
    return count
  } catch (e) {
    return e
  }
}