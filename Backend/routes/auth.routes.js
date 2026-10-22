const { Router} = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const rateLimit = require('express-rate-limit')

const authRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false
})

const authRouter = Router()

authRouter.post("/register", authRateLimit, authController.registerUserController)


authRouter.post("/login", authRateLimit, authController.loginController)


authRouter.post("/logout", authController.logoutController)


authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter
