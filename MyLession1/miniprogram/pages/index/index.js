// 全部查询
/* const db = wx.cloud.database()
const _ = db.command

Page({
  query: function() {
    db.collection('data')
      .get({
        success: function(res) {
          console.log(res)
        }
      })
  }
}) */


// field
/* const db = wx.cloud.database()
const _ = db.command
Page({
  query: function() {
    db.collection('data')
      .field({
        xkc: true
      })
      .get({
        success: res => {
          console.log(res)
        }
      })
  }
}) */


// where
/* const db = wx.cloud.database()
const _ = db.command
Page({
  query: function() {
    db.collection('data')
      .where({
        count: _.in([1,6])
      })
      .get({
        success: res => {
          console.log(res)
        }
      })
  }
}) */

// where 正则表达式
const db = wx.cloud.database()
const _ = db.command
Page({
  query: function() {
    db.collection('data')
      .where({
        good: new RegExp({
          regexp: 'good-[0-9]',
          options: 'i'
        })
      })
      .get({
        success: res => {
          console.log(res)
        }
      })
  }
})