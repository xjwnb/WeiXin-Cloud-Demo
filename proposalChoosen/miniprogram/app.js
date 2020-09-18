let r = ''
App({
  globalData: {
    user: {}
  },
  async onLaunch() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "xkctest-3p3ce",
        traceUser: true,
      })
    }

    this.globalData = {}
    r = await wx.cloud.callFunction({
      name: 'pc_userLogin'
    })
    console.log(r)
    let user = r.result.user
    if (r.result.user.name == 'nobody') {
      console.log('nobody')
      wx.redirectTo({
        url: '/pages/register/register',
      })
    } else {
      this.globalData.user = user
      console.log(user.target)
      console.log(user)
      console.log(this.globalData.user)
      if (!user.target) {
        console.log(user.target)
        wx.redirectTo({
          url: '/pages/rank/rank',
        })
      }
    }
    console.log(this.globalData.user)
  }
})