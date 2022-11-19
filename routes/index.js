// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引入模組
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')

// 建立 middleware 設定檔以後，掛載auth.js
const { authenticator } = require('../middleware/auth')

// 導向模組 ， 加入驗證程序
router.use('/todos', authenticator, todos)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)


module.exports = router