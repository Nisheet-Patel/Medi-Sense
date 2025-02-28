const express = require('express')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

const staticRouter = express.Router()

// staticRouter.get('/dashboard', authMiddleware, (req, res) => {    
//     res.json({ userId: req.userId });
// });


staticRouter.get('/dashboard', (req, res, next) => {
    console.log("Route hit: /dashboard");
    next();
}, authMiddleware, (req, res) => {
    console.log("Final handler executing");
    res.json({ userId: req.userId });
});


staticRouter.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});



module.exports = staticRouter
