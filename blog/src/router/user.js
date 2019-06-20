const { login } = require('../controller/login')
// const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = async (req, res) => {
  // 获取到发送数据的模型（这个模型的作用就是统一发送数据的格式）
  const { SucessModel, ErrorModel } = require('../model/resModel')
  const method = req.method
  // 登录的接口
  if (method === 'GET' && req.path === '/api/user/login') {
    // const { username, password } = req.body
    const { username, password } = req.query
    console.log(req.query, 14)
    const result = login(username, password)
    return result.then(data => {
      console.log(data, 16)
      if (data.username) {
        // 设置 session
        req.session.username = data.username
        req.session.realname = data.realname
        // 同步到 redis
        set(req.sessionId, req.session)

        return new SucessModel('登录成功')
      }
      return new ErrorModel('登录失败')
    })
  }

  // 登录验证的测试
  if (method === 'GET' && req.path === '/api/user/login-test') {
  }
}

module.exports = handleUserRouter
