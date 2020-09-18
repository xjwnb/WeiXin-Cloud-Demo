let res = ''
Page({
  data: {
    picker: {
      arr: ['0', '1', '2', '3', '4', '5', '6'],
      index: 1
    }
  },
  // 验证姓名
  nameChange: function (e) {
    this.checkName(e.detail.value)
  },
  // 验证手机号
  phoneChange: function (e) {
    this.checkPhone(e.detail.value)
  },
  // checkName() 方法
  checkName: function (data) {
    var reg = /^[\u4EOO-\u9FA5A-Za-z]+$/
    return this.check(data, reg, '姓名输入错误!')
  },
  // checkPhone() 方法
  checkPhone: function(data) {
    var reg = /^(((13)|(15)|(17)|(18))\d{9})$/
    return this.check(data, reg, '手机号码输入有误！')
  },
  // check()方法
  check: function(data, reg, errMsg) {
    if (!reg.test(data)) {
      wx.showToast({
        title: errMsg,
        icon: 'none',
        duration: 1500
      })
    }
    return true
  },
  bindKeyInput: function(e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },
  async subscribe(e) {
    res = await wx.cloud.callFunction({
      name: 'sendMessagePro'
    })
/*     let data = res.result.data
    data.map(async item => {
      res = await wx.cloud.callFunction({
        name: 'sendMessageProOne',
        data: {
          id: item.id.toString()
        }
      })
    }) */
    console.log(res)
    /* res = await wx.requestSubscribeMessage({
      tmplIds: ['VpUy7likRvUJGEJWA6F8eLtt9zzyVI4yI2RiFzPhmz8'],
    })
    console.log(res)
    if (res) {
      console.log(this.data.name)
      console.log(this.data.wish)
      console.log(this.data.phone)
      res = await wx.cloud.callFunction({
        name: 'guest',
        data: {
          thing1: {value: this.data.name},
          thing2: {value: '王辉辉&张琳琳婚礼'},
          thing4: {value: this.data.wish},
          date3: {value: '2020-5-13'},
          templateID: 'VpUy7likRvUJGEJWA6F8eLtt9zzyVI4yI2RiFzPhmz8',
          phone: this.data.phone
        }
      })
      console.log(res)
    } */
  }
})