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
  let openid = wxContext.OPENID
  console.log(openid)
  console.log(event)
  let { sn, name, nickName, avatarUrl } = event
  console.log(sn, name, nickName)
  let res = await studentCollection.where({
    sn,
    name
  }).get()
  let user = {}
  let reg = 'ok'
  let errMsg = ''
  if (res.data.length == 0) {
    reg = 'err'
    errMsg = '没找到匹配的学号姓名，请核实'
  } else {
    let { _id } = res.data[0]
    let student = res.data[0]
    if (!res.data[0].nickName) {
      res = await studentCollection.doc(_id).update({
        data: {
          nickName, avatarUrl, openid
        }
      })
      user = { ...student, nickName, avatarUrl }
    } else {
      reg = 'err'
      errMsg = '学号:' + sn + "已被微信昵称" + nickName + "绑定"
    }
  }

  return {
    reg, user, errMsg
  }
}