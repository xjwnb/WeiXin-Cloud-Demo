let app = getApp()
let r = ''
Page({
  data: {
    type:0,
    target:[
      ['web前端', '人工智能', '移动应用', '手机游戏'],     //transcore>=60分
      ['人工智能'],                                 //ai && transcore<60
      ['web前端',  '移动应用', '手机游戏'],  //!ai && transcore<60
            ]
  },  
  async onLoad(options) {
    //判断学生的类型
    let type = 0
    console.log(app.globalData.user)
    if(app.globalData.user.transcore<60)
      type = app.globalData.user.ai?1:2

    //设置target和choosen数组
    if(!app.globalData.user.target){
      app.globalData.user.target = this.data.target[type]
      app.globalData.user.choosen = []
      app.globalData.user.target.forEach((v, i) => { app.globalData.user.choosen.push(i)})
    }
    console.log(app.globalData.user)
    this.setData({
      user: app.globalData.user,
      type
    })
  },
  async post(res){
    console.log(app.globalData.user)
    console.log(this.data.user)
    let user = this.data.user
    user.target1=100
    console.log(user)
    r = await wx.cloud.callFunction({
      name:'pc_postChoice',
      data:{
        user
      }
    })
    console.log(r)
    if(r.result.result.errMsg.indexOf('ok')>0){
      console.log('showtoast')
      let r = await wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
    }
    wx.redirectTo({
      url: '/pages/profile/profile',
    })

  },
  change(res){
    console.log(res)
    //前面的顺序修改，后面的依次变动，后面的不能选前面的序号
    let choosen = this.data.user.choosen
    //当前picker的选择，已经出现在前面的志愿中，就拒绝
    let found = choosen.indexOf(Number(res.detail.value))
    console.log(found)
    if (found<=res.currentTarget.dataset.id){
      let errMsg = `第${found + 1}志愿已选`
      wx.showToast({
        title: errMsg,
      })
      return
    }else{
      choosen.splice(res.currentTarget.dataset.id,0,Number(res.detail.value))
      choosen.splice(choosen.lastIndexOf(Number(res.detail.value)),1)
    }
    let user = this.data.user
    user.choosen = choosen
    this.setData({
      user
    })
  }
})