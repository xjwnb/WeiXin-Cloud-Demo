let app = getApp()
let r = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ActivityId: '',
    memberCount: 1,
    roomLimit: 3,
    templateInfo: {
      parameterList: [{
        name: 'member_count',
        value: '2'
      }, {
        name: 'room_limit',
        value: '4'
      }]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if (JSON.stringify(options) != "{}") {
      await this.setData({
        activityId: options.activityId,
        memberCount: Number(options.memberCount) + 1,
        roomLimit: Number(options.roomLimit)
      })
      let { activityId, memberCount, roomLimit }  = this.data
      r = await wx.cloud.callFunction({
        name: 'setUpdatableMsgUpdate',
        data: {
          activityId, memberCount, roomLimit
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow(e) {
    console.log('index onshow')
    if (app.globalData.shareTicket) {
      console.log(app.globalData.shareTicket)
      r = await wx.getShareInfo({
        shareTicket: app.globalData.shareTicket,
      })
      console.log(r)
      console.log('getshareInfo: ', r)
      r = await wx.cloud.callFunction({
        name: 'showCloudID',
        data: {
          shareData: wx.cloud.CloudID(r.CloudID)
        }
      })
      console.log(r)
      this.setData({
        groupId: r.result.shareData.data.openGId
      })
    }

    if (!this.data.activityId) {
      let res = await wx.cloud.callFunction({
        name: 'createActivityId'
      })
      console.log(res)
      res = await this.setData({
        activityId: res.result.activityId
      })
    }

    wx.showShareMenu({
      withShareTicket: true
    })

    let templateInfo = this.data.templateInfo
    templateInfo.parameterList[0].value = this.data.memberCount + ''
    templateInfo.parameterList[1].value = this.data.roomLimit + ''
    console.log(this.data.activityId)
    console.log(templateInfo)
    wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage : true,
      activityId: this.data.activityId,
      templateInfo
    })
  },

  onShareAppMessage(e) {
    return {
      title: '动态分享信息',
      path: '/pages/index/index?activityId=' + this.data.activityId + 
            "&memberCount=" + this.data.memberCount + 
            "&roomLimit=" + this.data.roomLimit
    }
  },

  async end(e) {
    r = await wx.cloud.callFunction({
      name: 'setUpdatableMsgEnd',
      data: {
        path: '/pages/index/index',
        activityId: this.data.activityId
      }
    })
    console.log(r)
  }

})