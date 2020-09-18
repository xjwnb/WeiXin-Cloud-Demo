// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "xkctest-3p3ce"
})

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let res = await db.collection('pc_student')
  .aggregate()
  .unwind({
    path: '$choosen',
    includeArrayIndex: 'index'  // 第几志愿
  })
  .match({
    index: 0
  })
  .project({
    name: 1,
    proposal: $.arrayElemAt(['$target', '$choosen']),
    total: 1
  })
  .sort({
    total: -1
  })
  .group({
    _id: '$proposal',
    students: $.push({
      name: '$name',
      total: '$total'
    })
  })
  .unwind({
    path: "$students",
    includeArrayIndex: 'rank'
  })
  .project({
    _id: 0,
    proposal: "$_id",
    rank: $.add(["$rank", 1]),
    total: "$students.total"
  })
  .limit(1000)
  .end()
  console.log(res)
  return { ...res }
  
}