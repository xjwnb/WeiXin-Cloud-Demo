let db = wx.cloud.database()
let vote = db.collection('vote')
let votes = db.collection('votes')
let $ = db.command.aggregate

let preDate = null
let nowDate = null
let preFileid = null
let preid = null
let current = 0
let openId = null

Page({
  data: {
    imglist: [],
    voted: false,
    // 当前的swiper current
    swiperCurrent: 0,
    // 图片数量
    imgNum: null,
    // 姓名标题
    title: '投票 肖佳炜',
    // 已投票数
    ticket: null
  },
  onLoad(options) {
    let today = new Date().toDateString()
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res.result.openid)
      openId = res.result.openid
      votes.where({
          _openid: res.result.openid,
          data: today
        }).get()
        .then(res => {
          preDate = res.data.length ? res.data[res.data.length - 1].date : null
          preFileid = res.data.length ? res.data[res.data.length - 1].fileid : null
          preid = res.data.length ? res.data[res.data.length - 1]._id : null
          this.setData({
            voted: !!res.data.length
          })

        })
    })
    // 图片列表
    vote.get().then(res => {
      this.setData({
        imgNum: res.data.length
      })

      let tlist = res.data
      votes.aggregate()
        .group({
          _id: "$fileid",
          count: $.sum(1)
        }).end().then(res => {
          tlist.forEach(val => {
            res.list.find(v => {
              if (v._id == val.fileid)
                val.vote = v.count
            })
          })
          this.setData({
            imglist: tlist
          }, () => {
            let arr = this.data.imglist.map(item => item.vote)
            this.setData({
              ticket: arr
            })

            wx.setNavigationBarTitle({
              title: String(this.data.swiperCurrent + 1) + "/" + String(this.data.imgNum) + "\t" + "票数:" + this.data.ticket[0] + "\t" + this.data.title,
            })
          })
        })
    })

  },
  vote(e) {
    console.log(e)
    let handleFileid = e.target.dataset.fileid
    console.log(handleFileid)
    // 判断前后两次点击是否为不同日期
    nowDate = new Date()
    if (preDate) {
      if (nowDate.getFullYear() !== preDate.getFullYear() || nowDate.getMonth() !== preDate.getMonth() || nowDate.getDate() !== preDate.getDate()) {

        this.setData({
          voted: false
        })
      } else {
        this.setData({
          voted: true
        })
        if (preFileid === handleFileid) {
          wx.showModal({
            title: '投票',
            content: '是否取消投票',
            success: res => {
              if (res.confirm) {
                wx.showLoading({
                  title: '正在删除中。。。',
                })
                // 删除
                votes.doc(preid).remove({
                  success: res => {
                    wx.showToast({
                      title: '删除成功',
                    })
                    let newTick = this.data.ticket.map((item, index) => {
                      if (index === current) {
                        return --item
                      }
                      return item
                    })
                    this.setData({
                      ticket: newTick
                    })
                    // 更新标题栏
                    wx.setNavigationBarTitle({
                      title: current + 1 + "/" + String(this.data.imgNum) + "\t" + "票数:" + String(this.data.ticket[current]) + "\t" + this.data.title,
                    })
                    console.log(this.data.voted)
                    this.setData({
                      voted: false
                    })
                    console.log(this.data.voted)

                    votes.where({
                      _openid: openId
                    }).get().then(res => {

                      preDate = res.data[res.data.length - 1] ? res.data[res.data.length - 1].date : null
                      preFileid = res.data[res.data.length - 1] ? res.data[res.data.length - 1]._id : null
                    })

                    wx.hideLoading()
                  },
                  fail: err => {
                    wx.showToast({
                      title: '删除失败',
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '取消操作',
                })
              }
            }
          })
        }

      }
    } else {
      this.setData({
        voted: false
      })
    }
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
        date: date
      }
    }).then(res => {
      this.data.voted = true
      let newTick = this.data.ticket.map((item, index) => {
        if (index === current) {
          return ++item
        }
        return item
      })
      this.setData({
        ticket: newTick
      })
      wx.setNavigationBarTitle({
        title: String(this.data.swiperCurrent) + "/" + String(this.data.imgNum) + "\t" + "票数:" + String(this.data.ticket[current]) + "\t" + this.data.title,
      })
      wx.showToast({
        title: '投票成功',
      })
      preDate = new Date()
      votes.where({
        _openid: openId
      }).get().then(res => {
        preFileid = res.data[res.data.length - 1].fileid
        preid = res.data[res.data.length - 1]._id
      })
    })
  },
  // 滑动swiper组件
  changeSwiper(e) {
    current = e.detail.current

    // 修改 navigationBarTitle
    let newCurrent = e.detail.current + 1
    this.setData({
      swiperCurrent: newCurrent
    }, () => {
      let tick = this.data.imglist[newCurrent - 1].vote ? this.data.imglist[newCurrent - 1].vote : 0

      wx.setNavigationBarTitle({
        title: String(newCurrent) + "/" + String(this.data.imgNum) + "\t" + "票数:" + String(this.data.ticket[current]) + "\t" + this.data.title,
      })
    })
  }
})