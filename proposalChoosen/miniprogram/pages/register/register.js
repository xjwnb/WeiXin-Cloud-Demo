let r = ''
let app = getApp()
Page({
  data: {
    nickName: '',
    avatarUrl: '',
  },
  async formsubmit(e) {
    let {
      sn,
      name
    } = e.detail.value
    // console.log(sn, name)
    if (!this.data.nickName) {
      wx.showToast({
        title: '请获取微信信息'
      })
      return
    }
    if (!sn || !name) {
      wx.showToast({
        title: '请输入学号姓名',
      })
      return
    }
    if (!/\d{8}/.test(sn)) {
      wx.showToast({
        title: '请输入8位学号',
      })
      return
    }
    let nickName = this.data.nickName
    let avatarUrl = this.data.avatarUrl
    r = await wx.cloud.callFunction({
      name: 'pc_register',
      data: {
        name,
        sn,
        nickName,
        avatarUrl
      }
    })
    console.log(r)
    if (r.result.reg == 'ok') {
      app.globalData.user = r.result.user
      console.log(app.globalData.user)
      wx.showToast({
        title: '绑定成功',
      })
      wx.redirectTo({
        url: '/pages/rank/rank',
      })
    } else {
      wx.showModal({
        title: r.result.reg,
        content: r.result.errMsg,
      })
    }
  },
  getUserInfo(e) {
    let {
      nickName,
      avatarUrl
    } = JSON.parse(e.detail.rawData)
    // console.log(nickName, avatarUrl)
    this.setData({
      nickName,
      avatarUrl
    })
  }
})