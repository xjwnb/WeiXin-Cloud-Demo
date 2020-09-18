// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "xkctest-3p3ce"
})

const db = cloud.database()
const studentCollection = db.collection('pc_student')


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = cloud.getWXContext().OPENID
  console.log(openid)
  let student = await studentCollection.where({
    openid: openid
  }).get()
  console.log(student)
  let result = {}
  if (student.data.length > 0) {
    result = student.data[0]
  } else {
    result = { name: 'nobody' }
  }

  return {
    openid: wxContext.OPENID,
    user: result
  }
}