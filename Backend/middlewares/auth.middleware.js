const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

async function authUser(req, res, next) {

    const token = req.cookies?.token
    
    console.log('🔐 [AUTH MIDDLEWARE] Checking authentication...')
    console.log('🔐 [AUTH MIDDLEWARE] Token from cookies:', req.cookies?.token ? '✓ Found' : '✗ Not found')
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = { authUser }