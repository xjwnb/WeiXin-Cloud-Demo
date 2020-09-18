// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "xkctest-3p3ce"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let { activityId, path } = event
  targetState = 1
  templateInfo = {
    parameterList: [{
      name: 'path',
      value: path
    }, {
      name: 'version_type',
      value: 'develop'
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