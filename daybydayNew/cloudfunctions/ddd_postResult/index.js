// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xkctest-3p3ce'
})

const db = cloud.database()
const _ = db.command
const recordCollection = db.collection('ddd_records')
const studentCollection = db.collection('ddd_students')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let openid = cloud.getWXContext().OPENID
  let student = await studentCollection.where({
    _openid: openid
  }).get()
  console.log(event)
  console.log(student)
  if (event.score != 0) {
    let res = await studentCollection.where({
      _openid: openid
    }).update({
      data: {
        score: _.inc(event.score)
      }
    })
    console.log(res)
    student.data[0].score += event.score
    console.log(student.data[0])
  }

  let record = event
  record.postDate = new Date()
  record.openid = openid

  let res = await recordCollection.add({
    data: record
  })
  return student.data[0]

}