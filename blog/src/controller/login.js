const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
  username = escape(username)

  // 生成加密密码
  password = genPassword(password)
  password = escape(password)

  console.log(password, 11)

  const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
  console.log('sql is', sql)
  return exec(sql).then(rows => {
    console.log(rows, 18)
    return rows[0] || {}
  })
}

module.exports = {
  login
}
