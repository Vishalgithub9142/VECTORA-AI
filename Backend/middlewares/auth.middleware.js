const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

async function authUser(req, res, next) {

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1] || req.body?.token
    
    console.log('🔐 [AUTH MIDDLEWARE] Checking authentication...')
    console.log('🔐 [AUTH MIDDLEWARE] Token from cookies:', req.cookies?.token ? '✓ Found' : '✗ Not found')
    console.log('🔐 [AUTH MIDDLEWARE] Token from Authorization header:', req.headers.authorization ? '✓ Found' : '✗ Not found')

    if (!token) {
        console.log('❌ [AUTH MIDDLEWARE] No token provided - UNAUTHORIZED')
        return res.status(401).json({ message: "Unauthorized" })
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({ token })

    if (isBlacklisted) {
        console.log('❌ [AUTH MIDDLEWARE] Token is blacklisted - UNAUTHORIZED')
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('✅ [AUTH MIDDLEWARE] Token verified successfully for user:', decoded.id)
        req.user = decoded
        next()

    } catch (error) {
        console.log('❌ [AUTH MIDDLEWARE] Token verification failed:', error.message)
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = { authUser }