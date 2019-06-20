const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get, set } = require('./src/db/redis')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
  // console.log('d.toGMTString() is ', d.toGMTString())
  return d.toGMTString()
}

// 利用node自带的queryString处理GET获得的数据
const querystring = require('querystring')
module.exports = (req, res) => {
  res.setHeader('Content-type', 'application/json')
  const url = req.url
  req.path = url.split('?')[0]
  req.query = querystring.parse(url.split('?')[1])
  // 解析cookie
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    // 有于前端可以修改cookie，
    // 所以我们消息头里面需要设置'set-cookie'的时候添加上httpOnly
    // 加上这个以后就会在每次请求的时候自动带上这个cookie放在最后,
    // 这样就可以覆盖掉前端添加的同名cookie
    // 但是自动带上的时候,会在前面自动添加一个空格,所以我们需要通过字符换的trim()来把空格删除掉
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  })

  // 处理postdata的函数
  const getPostData = req => {
    const promise = new Promise((resolve, reject) => {
      if (req.method !== 'POST') {
        console.log('not post')
        resolve({})
        return
      }
      if (req.headers['content-type'] !== 'application/json') {
        console.log('not application/json')
        resolve({})
        return
      }
      let postData = ''
      req.on('data', chunk => {
        postData += chunk.toString()
      })
      req.on('end', () => {
        console.log('postdata is'+ postData);
        resolve(JSON.parse(postData))
      })
    })
    return promise
  }

  // // 解析session
  // // 判断是否需要穿一个userId在cookie里面
  // let needSetCookie = false
  // // 获取cookie中的uerid
  // let userId = req.cookie.userId
  // // 如果userId有值
  // if (userId) {
  //   // 如果session中没有对应的userId的数据
  //   // 那么就让它在session中初始化
  //   // 这种情况应该不会出现，有userId却没有值？
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {}
  //   }
  //   // 如果userId没值，也就代表是第一次登录
  // } else {
  //   // 需要设置一个userId在cookie里面
  //   needSetCookie = true
  //   // 随机生成一个不会重复的userId
  //   userId = `${Date.now()}_${Math.random()}`
  //   // 在session中对这个id的数据初始化
  //   SESSION_DATA[userId] = {}
  // }
  // // 不管是怎么样，都把这个userId的session数据放入req.session，方便数据的交互
  // // 注意这里是引用值的赋值，也就代表 req.session改变的时候，SESSION_DATA[userId]也会改变
  // req.session = SESSION_DATA[userId]

  // 解析 session （使用 redis）
  let needSetCookie = false
  console.log('cookie', req.cookie.userId)
  let userId = req.cookie.userId
  if (!userId) {
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
    // 初始化 redis 中的 session 值
    set(userId, {})
    console.log('第一次登录')
  }
  // 获取 session
  req.sessionId = userId
  get(req.sessionId)
    .then(sessionData => {
      console.log('sessionData', sessionData)
      if (sessionData == null) {
        // 初始化 redis 中的 session 值
        set(req.sessionId, {})
        // 设置 session
        console.log(123123)
        req.session = {}
      } else {
        // 设置 session
        req.session = sessionData
      }
      // console.log('req.session ', req.session)

      // console.log('req.sessionId ', req.sessionId)
      // 处理 post data
      return getPostData(req)
    })
    .then(async postData => {
      req.body = postData
      // 不管有没有post请求，都会执行下面对接口的处理，
      // 但是这些操作都变成了异步执行了，是在获取完数据以后执行

      // 处理blog路由

      // 对于是否需要放cookie进行判断
      if (needSetCookie) {
        res.setHeader(
          'Set-Cookie',
          `userId=${userId}; path=/; httpOnly;exprice=${getCookieExpires()}`
        )
      }

      // 由于handleBlogRouter得到的结果为一个await返回的promise对象，所以也需要进行异步获取
      const blogData = await handleBlogRouter(req, res)
      if (blogData) {
        res.end(JSON.stringify(blogData))
        return
      }

      // 处理user路由

      // 对于是否需要放cookie进行判断
      if (needSetCookie) {
        res.setHeader(
          'Set-Cookie',
          `userId=${userId}; path=/; httpOnly;exprice=${getCookieExpires()}`
        )
      }

      const userData = await handleUserRouter(req, res)
      if (userData) {
        res.end(JSON.stringify(userData))
        return
      }

      // 没有接口可以访问
      res.writeHead(404, { 'Content-type': 'text/plain' })
      res.write('404 not Found\n')
      res.end()
    })
}
