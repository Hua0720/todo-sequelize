// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 model
const db = require('../../models')

const Todo = db.Todo
const User = db.User

// 定義首頁路由
router.get('/', (req, res) => {
  const UserId = req.user.id   // 變數設定
  User.findByPk(UserId)
    .then(user => {
      if (!user) throw new Error('user not found')

      return Todo.findAll({
        raw: true,             
        nest: true,
        where: { UserId }
      })
    })
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

// 匯出路由模組
module.exports = router