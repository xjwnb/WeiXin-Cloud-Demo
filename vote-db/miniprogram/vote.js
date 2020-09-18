let db = wx.cloud.database()
let vote = db.collection('vote')
let votes = db.collection('votes')
// 数据聚合对象
let $ = db.command.aggregate

Page({
  data: {
    imglist: [],
    voted: false
  },
  onLoad(options) {
    
  }
})