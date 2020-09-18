Page({
  data: {
    isPlayingMusic: false
  },
  bgm: null,
  music_url: 'cloud://xkctest-3p3ce.786b-xkctest-3p3ce-1301752881/TheFatRat - Windfall (纯音乐).mp3',
  music_coverImgUrl: 'cloud://gdmecst-jbtsy.6764-gdmecst-jbtsy-1300726000/微信小程序图标.jpg',
  onLoad: function () {
    // 创建getBackgroundAudioManager实例对象
    this.bgm = wx.getBackgroundAudioManager()
    // 音频标题
    this.bgm.title = 'merry me'
    this.bgm.onPlay(res=>{
      this.setData({
        isPlayingMusic:true
      })
    })
    // 指定音频的数据源
    this.bgm.src = this.music_url
  },
  // 播放器的单击事件
  play: function () {
    if (this.data.isPlayingMusic) {
      this.bgm.pause()
    } else {
      this.bgm.play()
    }
    this.setData({
      isPlayingMusic: !this.data.isPlayingMusic
    })
  },
  // 一键拨打电话
  // 新郎电话
  callGroom: function () {
    wx.makePhoneCall({
      phoneNumber: '13700000000'
    })
  },
  // 新娘电话
  callBride: function () {
    wx.makePhoneCall({
      phoneNumber: '15600000000'
    })
  }
})
