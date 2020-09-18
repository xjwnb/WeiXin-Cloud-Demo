// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "xkctest-3p3ce"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { activityId, memberCount, roomLimit } = event

  targetState = 0
  memberCount = memberCount + ''
  roomLimit = roomLimit + ''
  templateInfo = {
    parameterList: [{
      name: 'member_count',
      value: memberCount
    }, {
      name: 'room_limit',
      value: roomLimit
    }]
  }
  let res = await cloud.openapi.updatableMessage.setUpdatableMsg({
    activityId, targetState, templateInfo
  })
  console.log(res)
  return {
    ...res
  }
}