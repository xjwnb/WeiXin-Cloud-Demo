// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xkctest-3p3ce'
})

const db = cloud.database()
const studentCollection = db.collection('ddd_students')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openid = cloud.getWXContext().OPENID
  let student = await studentCollection.where({
    _openid: openid
  }).get()
  let user = {}
  console.log(student)
  if (student.data.length > 0) {
    user = student.data[0]
  } else {
    user = {
      name: 'nobody'
    }
  }
  return {
    openid,
    user
  }
}