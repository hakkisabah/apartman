const JWT = require('jsonwebtoken')
// require('dotenv').config() // if need on development
const login = (req, res) => {
  if (req.body.password === process.env.USER_PASS || req.body.password === process.env.ADMIN_PASS) {
    const isAdmin = req.body.password === process.env.ADMIN_PASS  ? 'admin' : 'user'
    return res.status(200).json({
      status: 'success',
      message: 'Login success',
      user: isAdmin,
      token: JWT.sign({
        user: isAdmin
      }, process.env.JWT_SECRET),
    })
  } else {
    return res.status(200).json({
      status: 'error',
      message: 'Login failed',
      token: null
    })
  }
}
exports.login = login

const checkLogin = async (req, res, next) => {
  try {
    await JWT.verify(req.token, process.env.JWT_SECRET)
    next()
  } catch (e) {
    return res.status(200).json({
      status: 'error',
      message: 'Auth failed',
      token: null
    })
  }
}
exports.checkLogin = checkLogin

const checkAdminLogin = async (req, res, next) => {
  try {
    const isAdmin = await JWT.verify(req.token, process.env.JWT_SECRET)
    if (isAdmin.user === 'admin') {
      next()
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Auth failed',
        token: null
      })
    }
  } catch (e) {
    return res.status(200).json({
      status: 'error',
      message: 'Auth error',
      token: null
    })
  }
}
exports.checkAdminLogin = checkAdminLogin

const verifyToken = async (req, res) => {
  try {
    const isAuth = await JWT.verify(req.token, process.env.JWT_SECRET)
    if (isAuth.user === 'admin' || isAuth.user === req.body.user) {
      return res.status(200).json({
        status: 'success',
        message: 'Verify success',
        user: isAuth.user
      })
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden',
        token: null
      })
    }

  } catch (e) {
    return res.status(200).json({
      status: 'error',
      message: 'Verify failed',
      token: null
    })
  }
}
exports.verifyToken = verifyToken