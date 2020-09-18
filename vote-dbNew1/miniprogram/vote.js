let db = wx.cloud.database()
let vote = db.collection('vote')
let votes = db.collection('votes')
let $ = db.command.aggregate

Page({
  data: {
    imglist: [],
    voted: false
  },
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res)
      votes.where({
          _openid: res.result.openid
        }).get()
        .then(res => {
          console.log(res)
          this.setData({
            voted: !!res.data.length
          })
        })
    })
    // 图片列表
    vote.get().then(res => {
      let tlist = res.data
      votes.aggregate()
        .group({
          _id: "$fileid",
          count: $.sum(1)
        }).end().then(res => {
          tlist.forEach(val => {
            res.list.find(v => {
              if (v._id == val.fileid) {
                val.vote = v.count
              }
            })
          })
          this.setData({
            imglist: tlist
          }, () => {
            console.log(this.data.imglist)
          })
        })
    })
  },
  tap(e) {
    console.log(e)
    if (this.data.voted) {
      wx.showToast({
        title: '已投票，不能再投',
      })
      return
    }
    let date = new Date()
    votes.add({
      data: {
        fileid: e.target.dataset.fileid,
        date: date
      }
    }).then(res => {
      console.log(res)
      this.data.voted = true
      wx.showToast({
        title: '投票成功',
      })
    })
  }
})