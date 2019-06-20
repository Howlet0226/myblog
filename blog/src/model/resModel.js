class BaseModel {
  constructor(data, message) {
    // 如果data是字符串，直接赋值给this.message,说明是消息，
    // 非常的窍门的解决了没有数据返回，只返回提示信息
    if (typeof data === 'string') {
      this.message = data
      // 赋值为空，防止后面的操作
      data = null
      message = null
    }
    // 如果data有值，就把它放在this.data上面
    if (data) {
      this.data = data
    }
    // 如果message有值，就把它放在this.message上面
    if (message) {
      this.message = message
    }
  }
}

class SucessModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.errno = 0
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message)
    this.errno = 1
  }
}

module.exports = {
  SucessModel,
  ErrorModel
}
