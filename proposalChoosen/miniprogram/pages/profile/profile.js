const app=getApp()
Page({
  data:{
    list:['a','b','c']
  },
  async onLoad(options){
    let res = await wx.cloud.callFunction({
      name:'pc_statistics'
    })
    console.log(res)
    let list = []
    list.push(res.result.list.filter(v=>{return v.proposal=='web前端'}))
    list.push(res.result.list.filter(v=>{return v.proposal=='人工智能'}))
    list.push(res.result.list.filter(v=>{return v.proposal=='移动应用'}))
    list.push(res.result.list.filter(v=>{return v.proposal=='手机游戏'}))
    this.setData({
      user: app.globalData.user,
      list
    })
    console.log(this.data.list)
  },
    // 页面切换
    changeItem: function (e) {
      this.setData({
        item: e.target.dataset.item
      })
      console.log(this.data.item)
    },
      // tab切换
  changeTab: function (e) {
    this.setData({
      tab: e.detail.current
    })
    console.log(this.data.tab)
  },
  rank(res){
    wx.redirectTo({
      url: '/pages/rank/rank',
    })
  }
})