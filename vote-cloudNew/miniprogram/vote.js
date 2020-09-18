const db = wx.cloud.database()
const candidate = db.collection('candidate')
const posts = db.collection('posts')
let res = null
let app = getApp()
Page({
  data: {
    candidates: [], //候选人数组
    posted: false, //已投票状态,
    cssClass: []
  },
  //页面加载生命周期回调
  onLoad: async function (options) {

    //调用云函数posted获取是否投过票
    res = await wx.cloud.callFunction({
      name: 'posted'
    })

    //根据posted云函数返回的结果设置已投票状态
    this.setData({
      posted: res.result.total > 0
    })

    res = await candidate.get()

    let cssClass = []
    res.data.map(item => {
      if (item.vote) {
        return cssClass.push(true)
      }
      return cssClass.push(false)
    })

    let candidates = res.data //候选人数组
    let swiperCurrent = 0 //设置轮播图初始编号
    await this.setData({
      candidates,
      swiperCurrent,
      cssClass
    })
    //刷新标题栏
    this.setBar(this.data.swiperCurrent)
    // 获取本地存储数据
    let imageFileID = wx.getStorageSync("addImageFileID")
    // 若存在本地存储
    if (imageFileID) {
      let currentIndex = this.data.candidates.length - 1
      this.setData({
        swiperCurrent: currentIndex
      })
    }
  },

  // 点击投票事件
  async tap(res) {
    //如果已投票，提示不能再投
    if (this.data.posted) {
      //挑战任务2 取消投票提示，然后调用云函数取消投票。
      const currentFileID = this.data.candidates[this.data.swiperCurrent].fileID
      console.log(currentFileID)
      let res1 = await wx.cloud.callFunction({
        name: 'findPostsByFileID',
        data: {
          fileID: currentFileID
        }
      })
      console.log(res1.result.data)
      if (res1.result.data.length) {
        wx.showModal({
          title: '是否取消投票',
          content: '是否取消投票',
          success: async res => {
            if (res.confirm) {
              console.log('yes')
              wx.showLoading({
                title: '正在取消投票',
                icon: 'success'
              })
              let deleteHandle = await wx.cloud.callFunction({
                name: 'deletePosts',
                data: {
                  fileID: currentFileID
                }
              })
              wx.hideLoading()
              wx.showToast({
                title: '你成功取消投票',
                icon: 'success'
              })
              console.log(currentFileID)

              let index = this.data.swiperCurrent
              let cssClass = this.data.cssClass.map((item, i) => {
                if (index === i) {
                  item = false
                  return item
                }
                return item
              })
              console.log(cssClass)
              this.setData({
                cssClass
              }, () => {
                console.log(this.data.cssClass)
              })
              //页面的data的当前候选人的票数减一
              this.data.candidates[this.data.swiperCurrent].vote--
              //设置已投票标志位为true
              this.data.posted = false
              //更新标题栏
              this.setBar(this.data.swiperCurrent)
            } else {
              wx.showToast({
                title: '你已取消操作',
                icon: 'success'
              })
            }
          },
        })
        return
      } else {
        wx.showToast({
          title: '投过票不能再投！',
          icon: 'success'
        })
        return
      }

    }
    res = await wx.showModal({
      title: '投票确认',
      content: '确定投这件作品吗？',
      success: async res => {
        if (res.confirm) {
          //调用云函数post上传投票信息
          res = await wx.cloud.callFunction({
            name: 'post',
            data: {
              fileID: this.data.candidates[this.data.swiperCurrent].fileID
            }
          })
          res = await wx.cloud.callFunction({
            name: 'findImage',
            data: {
              fileID: this.data.candidates[this.data.swiperCurrent].fileID
            }
          }).then(res => {
            console.log(res)
            let {
              _id
            } = res.result.data[0]

            console.log(_id)
            let index = this.data.candidates.findIndex((item, index) => {
              if (item._id === _id) {
                return index
              }
            })
            console.log(index)
            console.log(this.data.cssClass)
            let cssClass = this.data.cssClass.map((item, i) => {
              if (index === i) {
                item = true
                return item
              }
              return item
            })
            console.log(cssClass)
            this.setData({
              cssClass
            }, () => {
              console.log(this.data.cssClass)
            })
          })
          // 操作图片结束

          //页面的data的当前候选人的票数加1
          this.data.candidates[this.data.swiperCurrent].vote++
          //设置已投票标志位为true
          this.data.posted = true

          //更新标题栏
          this.setBar(this.data.swiperCurrent)
        }
      }
    })

  },
  async schange(res) {
    await this.setData({
      swiperCurrent: res.detail.current
    })
    this.setBar(res.detail.current)
  },
  setBar(current) {
    //设置标题栏内容
    wx.setNavigationBarTitle({
      title: '肖佳炜' + (current + 1) + "/" + this.data.candidates.length + " 票数：" + this.data.candidates[current].vote
    })
  },

  // 长按添加图片
  async long(e) {
    // 打开手机相册或相机获取图片
    res = await wx.chooseImage({
      count: 1,
      success: async res => {
        res = await wx.cloud.uploadFile({
          cloudPath: res.tempFilePaths[0].replace(/(.*\/)*([^.]+)/i, "$2"),
          filePath: res.tempFilePaths[0]
        })
        let {
          fileID
        } = res
        // let fileID = res.fileID
        res = await wx.cloud.callFunction({
          name: 'addCandidate',
          data: {
            fileID
          }
        }).then(res => {
          // 添加图片过后把图片路径保存到本地存储
          wx.setStorageSync("addImageFileID", fileID)
        })

        // 重新加载当前页面
        wx.reLaunch({
          url: getCurrentPages()[0].route
        })
      }
    })

  }
})