const xss = require('xss')
const { exec } = require('../db/mysql')
const getList = (author, keyword) => {
  // 这里做了一个很巧妙的占位，1=1，统一的处理了不管传没有传参数过来
  // 不仅查询数据库，在发送GET请求的时候，也可以做相关的处理
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`

  // 返回 promise
  return exec(sql)
}

const getDetail = id => {
  const sql = `select * from blogs where id='${id}'`
  // 由于我们这里返回的数据是放在一个数组里面的
  // 所以我们要通过then来对数据进行处理，然后返回一个新的promise
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData就是一个博客对象，包含 title content author 等属性
  // 返回一个id给前端使用
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createTime = Date.now()

  const sql = `
  insert into blogs (title, content, createtime, author)
  values ('${title}', '${content}', ${createTime}, '${author}');
`

  return exec(sql).then(insertData => {
    // console.log('insertData is ', insertData)
    // insertData是一个对象，里面就有有关新添数据的信息，其中的insertId就是添加进去的id
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  // id就是要更新博客的id
  // blogData就是一个博客对象，包含 title content 等属性
  // 这里不需要author，更新都是更新自己的博客，不会去更新名字
  if (!id) {
    var id = blogData.id
  }
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const sql = `
  update blogs set title='${title}',content= '${content}' where id = '${id}'
  `
  return exec(sql).then(updateData => {
    // 当更新成功的时候，会返回一个updateData对象
    // 里面有一个属性为affectedRows，当它大于0，就代表影响了行数大于0
    // 就代表成功了
    console.log(updateData.affectedRows)
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  // id就是你要删除的那个博客
  // 这里需要传一个author过来，
  // 如果我们删除的时候只用id去作为条件，那么很可能出现别人来删你的文章
  // 如果我们加上了author过来，author是在登陆的时候获取的，
  // 在执行删除的sql语句的时候，你就只能删除你自己的文章
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })

  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}
