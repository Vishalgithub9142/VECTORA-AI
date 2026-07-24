const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: "Account with same username or email already exist" })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/'
    })

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })




}


async function loginController(req, res) {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/'
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })
}

async function logoutController(req, res) {

    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({ message: "No token found" })
    }

    await tokenBlacklistModel.create({ token })

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/'
    })

    res.status(200).json({ message: "User logged out successfully" })
}


async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User found successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginController,
    logoutController,
    getMeController
}