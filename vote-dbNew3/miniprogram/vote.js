let db = wx.cloud.database()
let vote = db.collection('vote')
let votes = db.collection('votes')
let $ = db.command.aggregate

let imgHandle = null
let current = 0
let openid = null
Page({
  data: {
    imglist: [],
    voted: false
  },
  onLoad(options) {
    let nowDate = new Date().toDateString()
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res)
      openid = res.result.openid
      votes.where({
        _openid: res.result.openid,
        date: nowDate
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
            wx.setNavigationBarTitle({
              title: 1 + '/' + this.data.imglist.length + "票数:" + this.data.imglist[current].vote + "投票 肖佳炜"
            })
          })
        })
    })

  },
  vote(e) {
    console.log(e)
    imgHandle = e.target.dataset.fileid
    if (this.data.voted) {
      wx.showToast({
        title: '今天已投票，不能再投',
      })
      return
    }
    let date = new Date().toDateString()
    votes.add({
      data: {
        fileid: e.target.dataset.fileid,
        date
      }
    }).then(res => {
      console.log(res)
      this.data.voted = true
      wx.showToast({
        title: '投票成功',
      })
      console.log(this.data.imglist)
      // 投票成功后更新票数
      let newImglist = this.data.imglist.map((item,index) => {
        if (item.fileid === imgHandle) {
          ++item.vote
          return item
        }
        return item
      })
      console.log(newImglist)
      this.setData({
        imglist: newImglist
      },() => {
        wx.setNavigationBarTitle({
          title: current + 1 + '/' + this.data.imglist.length + "票数:" + this.data.imglist[current].vote + "投票 肖佳炜"
        })
      })
    })
  },
  //
  changeSwiper(e) {
    current = e.detail.current
    wx.setNavigationBarTitle({
      title: current + 1 + '/' + this.data.imglist.length + "票数:" + this.data.imglist[current].vote + "投票 肖佳炜"
    })
  },
  // 长按操作
  longPress(e) {
    console.log(e)
    if (!this.data.voted) {
      wx.showToast({
        title: '你未投票，请选择投票',
      })
      return
    }
    wx.showModal({
      title: '是否取消投票',
      content: '是否取消投票',
      success: res=> {
        if (res.confirm) {
          let date = new Date().toDateString()
          votes.where({
            _openid: openid,
            date
          }).get().then(res=> {
            console.log(res)
            wx.showLoading({
              title: '正在删除中。。。',
            })
            let dateId = res.data[0]._id
            votes.doc(dateId).remove().then(res=> {
              console.log(res)
              wx.hideLoading()
              wx.showToast({
                title: '成功取消投票',
              })
              console.log(this.data.imglist)
              // 取消投票后更新票数
              let newImglist = this.data.imglist.map((item, index) => {
                if (item.fileid === imgHandle) {
                  --item.vote
                  return item
                }
                return item
              })
              console.log(newImglist)
              this.setData({
                imglist: newImglist
              }, () => {
                wx.setNavigationBarTitle({
                  title: current + 1 + '/' + this.data.imglist.length + "票数:" + this.data.imglist[current].vote + "投票 肖佳炜"
                })
              })
              this.setData({
                voted: false,
                imglist: newImglist
              })
            })
          })
        } else{
          wx.showToast({
            title: '你已取消操作',
          })
        }
      }
    })
  }
})