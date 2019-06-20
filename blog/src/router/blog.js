const handleBlogRouter = async (req, res) => {
  const method = req.method
  // 获取到数据
  const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
  } = require('../controller/blog')
  // 获取到发送数据的模型（这个模型的作用就是统一发送数据的格式）
  const { SucessModel, ErrorModel } = require('../model/resModel')
  //对id的获取，以便读取博客详情或者更新博客等操作
  const id = req.query.id

  // 统一的登录验证函数
  const loginCheck = req => {
    if (!req.session.username) {
      return new ErrorModel('尚未登录')
    }
  }

  // 获取博客列表的接口
  if (method === 'GET' && req.path === '/api/blog/list') {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    console.log('req.session', req.session)
    if (req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req)
      console.log(loginCheckResult, 31)
      if (loginCheckResult) {
        // 未登录
        console.log(123)
        return loginCheckResult
      }
      // 强制查询自己的博客
      author = req.session.username
    }

    // 由于获取的是promise，所以用async await的方式来获取异步数据
    const listData = await getList(author, keyword)
    // console.log(listData)
    return new SucessModel(listData)
  }
  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    if (req.query.isadmin) {
      // 管理员界面
      const loginCheckResult = loginCheck(req)
      // console.log(loginCheckResult, 31)
      if (loginCheckResult) {
        // 未登录
        // console.log(123)
        return loginCheckResult
      }
    }
    const result = await getDetail(id)
    return new SucessModel(result)
  }
  // 新建一篇博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }
    req.body.author = req.session.username
    const result = await newBlog(req.body)
    return new SucessModel(result)
  }
  // 更新博客的接口
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }

    const result = await updateBlog(id, req.body)
    if (result) {
      return new SucessModel()
    } else {
      return new ErrorModel('更新失败')
    }
  }
  // 删除博客的接口
  if (method === 'GET' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheckResult
    }
    const author = req.session.username
    const result = await delBlog(id, author)
    if (result) {
      return new SucessModel()
    }
    return new ErrorModel('删除失败')
  }
}

module.exports = handleBlogRouter
