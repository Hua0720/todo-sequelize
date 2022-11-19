// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 model
const db = require('../../models')
const User = db.User

// 引用 passport
const passport = require('passport')
// 引用 bcrypt
const bcrypt = require('bcryptjs')

// 加入「登入表單頁面」的路由
router.get('/login', (req, res) => {
  res.render('login')
})

// 加入「login登入進去」的路由
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',               // 成功重定向 '路由'
  failureRedirect: '/users/login'     // 失敗重定向 '登入畫面'
}))

// 加入「註冊頁面」的路由
router.get('/register', (req, res) => {
  res.render('register')
})

// 加入「註冊表單頁面」的路由
router.post('/register', (req, res) => {
  // 取得註冊表單參數 {} -> 放入物件，解構賦值語法
  const { name, email, password, confirmPassword } = req.body
  // 新增碰到錯誤時的陣列
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '所有欄位都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
 
  User.findOne({ where: { email } }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 如果還沒註冊：寫入資料庫
    return bcrypt
      .genSalt(10) 
      .then(salt => bcrypt.hash(password, salt)) 
      .then(hash => User.create({
        name,
        email,
        password: hash // 用雜湊值取代原本的使用者密碼
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})

// 設定登出路由
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
  })
})

module.exports = router
