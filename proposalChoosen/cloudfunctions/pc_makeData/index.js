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

  proposal = []
  // 1909选人工智能 0
  proposal.push({
    target: ['人工智能'],
    choosen: [0]
  })
  //1909转web前端 1
  proposal.push({
    target: ['web前端', '人工智能', '移动应用', '手机游戏'],
    choosen: [0, 1, 2, 3]
  })
  // 1909转手机游戏 2
  proposal.push({
    target: ['web前端', '人工智能', '移动应用', '手机游戏'],
    choosen: [3, 1, 2, 0]
  })
  // 软件转人工智能 3
  proposal.push({
    target: ['web前端', '人工智能', '移动应用', '手机游戏'],
    choosen: [1, 3, 2, 0]
  })
  // 软件选web前端 4
  proposal.push({
    target: ['web前端', '移动应用', '手机游戏'],
    choosen: [0, 1, 2]
  })
  // 软件选手机游戏 5
  proposal.push({
    target: ['web前端', '移动应用', '手机游戏'],
    choosen: [2, 1, 0]
  })
  // 软件选移动应用 6
  proposal.push({
    target: ['web前端', '移动应用', '手机游戏'],
    choosen: [1, 2, 0]
  })
  // 软件选web前端 7 因为 web前端两个班，所以两份
  proposal.push({
    target: ['web前端', '移动应用', '手机游戏'],
    choosen: [0, 1, 2]
  })
  // collection.get() / query.get() 云函数上限 100 条
  // 聚合的结果上限1000条
  let res = await db.collection('pc_student').aggregate()
    .project({
      _id: '$_id',
      transcore: '$transcore',
      ai: '$ai'
    })
    .limit(1000)
    .end()
  console.log(res.list.length)
  for (let i = 0; i < res.list.length; i++) {
    if (res.list[i].ai) {
      if (res.list[i].transcore < 60) { // 1909选人工智能
        let r = await studentCollection.doc(res.list[i]._id).update({
          data: {
            ...proposal[0]
          }
        })
      } else { // 1909转方向
        let rand = Math.round(Math.random() * 2 + 0.5)
        let r = await studentCollection.doc(res.list[i]._id).update({
          data: {
            ...proposal[rand]
          }
        })
      }
    } else {
      if (res.list[i].transcore >= 60) { // 软件选人工智能
        let r = await studentCollection.doc(res.list[i]._id).update({
          data: {
            ...proposal[3]
          }
        })
      } else { // 软件选各方向
        let rand = Math.round(Math.random() * 4 + 0.5) + 3 // 生成随机数 4， 5， 6 ， 7
        let r = await studentCollection.doc(res.list[i]._id).update({
          data: {
            ...proposal[rand]
          }
        })
      }
    }
  }

}