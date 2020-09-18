Page({
  data: {
    ranklist: {}
  },
  onLoad: async function(options) {
    const db = wx.cloud.database()
    const studentCollection = db.collection('ddd_students')
    let res = await studentCollection
      .orderBy('score', 'desc')
      .get()

    console.log(res)
    this.setData({
      ranklist: res.data
    })
  }
})