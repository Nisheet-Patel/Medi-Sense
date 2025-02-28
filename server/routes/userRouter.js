const express = require('express')
const { addUser, checkUser } = require('../controllers/user.controller')

const userRouter = express.Router()

const checkAuth = (req, res, next) => {
    next()
}

userRouter.post('/register', addUser);

userRouter.post('/login', checkAuth, checkUser);

module.exports = userRouter
