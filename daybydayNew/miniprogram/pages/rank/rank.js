let cloudResult = null
const db = wx.cloud.database()
const studentCollection = db.collection('ddd_students')
let current = 1
Page({
  data: {
    ranklist: {},
    iscore: {},
    
  },
  onLoad: async function (options) {


    cloudResult = await wx.cloud.callFunction({
      name: 'getStudents'
    })

    let data = cloudResult.result.data.sort((a,b) => {
      return b.score-a.score
    })
    let d = data.map((item, index) => {
      return {
        pm: index + 1,
        ...item
      }
    })

    let iscore = d.find(item => {
      return item._id === wx.getStorageSync('_id')
    })

    let res = await studentCollection
      .orderBy('score', 'desc')
      .get()

    let rank = res.data
    let ranklist = rank.map((item, index) => {
      return {
        pm: index + current,
        ...item
      }
    })
    current = rank.length + 1

    ranklist.unshift(iscore)

    let old = this.data.ranklist
    this.setData({
      ranklist
    })
  },

  onReachBottom() {
    wx.showLoading({
      title: '加载中',
    })
    this.getData()
  },

  async getData() {
    let res = await studentCollection.skip(this.page.skip)
      .orderBy('score', 'desc')
      .get()

    let rank = res.data
    let ranklist = rank.map((item, index) => {
      return {
        pm: index + current,
        ...item
      }
    })

    let old = this.data.ranklist
    if (ranklist.length > 0) {
      this.setData({
        ranklist: old.concat(ranklist)
      }, () => {
        this.page.skip += 20
        current = this.data.ranklist.length
        wx.hideLoading()
      })
    } else {
      wx.showToast({
        title: '没有数据了',
      })
    }
  },
  page: {
    skip: 20
  }
})