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

  let user = event.user
  console.log(user)
  let student = studentCollection.doc(user._id)
  // _id 字段不能更新，所以删掉user对象的_id属性
  delete user._id
  for (let i = 0; i < user.target.length; i++) {
    user['target' + (i + 1)] = user.target[user.choosen[i]]
  }
  let result = await student.update({
    data: {
      ...user
    }
  })
  return { result }
}