const test = require('../app')
const http = require('http')
const PORT = 8000
const server = http.createServer(test)
server.listen(PORT)
