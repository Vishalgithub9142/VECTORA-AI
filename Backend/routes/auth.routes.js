const { Router} = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const authRouter = Router()

authRouter.post("/register", authController.registerUserController)


authRouter.post("/login", authController.loginController)


authRouter.get("/logout", authController.logoutController)


authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter
